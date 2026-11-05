import {createHash} from "node:crypto";
import type {Client, Prompt, Resource, ResourceTemplateType, Tool} from "@modelcontextprotocol/client";
import {constant, injectable, logger, type OnDestroy} from "@tsed/di";
import type {PlatformMcpUpstreamSettings} from "../interfaces/PlatformMcpUpstreamSettings.js";
import {createUpstreamTransport} from "../utils/createUpstreamTransport.js";
import {isUpstreamSessionLost} from "../utils/isUpstreamSessionLost.js";
import {listAll} from "../utils/listAll.js";

const DEFAULT_POOL_MAX = 100;
const DEFAULT_IDLE_TIMEOUT = 300_000;
const MAX_RETRY_DELAY = 30_000;

/**
 * Tools, resources and prompts advertised by an upstream MCP server.
 *
 * @module platform/mcp
 */
export interface PlatformMcpUpstreamCatalog {
  tools: Tool[];
  resources: Resource[];
  resourceTemplates: ResourceTemplateType[];
  prompts: Prompt[];
}

/**
 * Live connection to an upstream MCP server and its cached catalog.
 *
 * @module platform/mcp
 */
export interface PlatformMcpUpstreamConnection {
  client: Client;
  getCatalog(): Promise<PlatformMcpUpstreamCatalog>;
  /**
   * Runs an upstream request with the client given to `fn`, keeping the connection out of the pool eviction while
   * it is pending. When the upstream lost the session of the connection, the request is replayed once on a new
   * connection: `fn` must send the request with the client it is given.
   */
  run<T>(fn: (client: Client) => Promise<T>): Promise<T>;
}

interface PoolEntry {
  lastUsed: number;
  pending: number;
  connection?: Promise<PlatformMcpUpstreamConnection>;
  client?: Client;
  failures: number;
  retryAt: number;
  error?: unknown;
}

/**
 * Owns the MCP clients connected to the upstream servers declared on the MCP endpoints.
 *
 * One connection is kept per upstream and per distinct set of interpolated values, so upstreams with
 * caller-independent credentials share a single connection while forwarded identities get their own.
 *
 * @module platform/mcp
 */
export class PlatformMcpGatewayService implements OnDestroy {
  protected pools = new Map<PlatformMcpUpstreamSettings, Map<string, PoolEntry>>();
  /**
   * Clients closed because the upstream lost their session.
   */
  protected lostSessions = new WeakSet<Client>();

  /**
   * Returns the connection matching the resolved upstream definition, connecting lazily.
   *
   * @param upstream Upstream declared in the configuration, identifying the pool.
   * @param resolved Same definition with its placeholders interpolated for the caller.
   */
  getConnection(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings = upstream
  ): Promise<PlatformMcpUpstreamConnection> {
    return this.acquire(upstream, resolved).connection;
  }

  /**
   * Replaces a connection whose session the upstream lost, then returns the connection to use.
   *
   * The connection is closed only while it is still the current one: the requests failing together share the
   * connection opened by the first of them.
   *
   * @param upstream Upstream declared in the configuration, identifying the pool.
   * @param resolved Same definition with its placeholders interpolated for the caller.
   * @param stale Connection whose session was lost.
   */
  async reconnect(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings,
    stale: Pick<PlatformMcpUpstreamConnection, "client">
  ): Promise<PlatformMcpUpstreamConnection> {
    const entry = this.getPool(upstream).get(this.getKey(resolved));

    if (entry?.client === stale.client) {
      logger().warn({
        event: "MCP_GATEWAY_SESSION_LOST",
        message: `MCP upstream "${this.getLabel(resolved)}": the upstream lost the session, reconnecting.`
      });

      // the requests still running on this client are aborted by the close: they are replayed too
      this.lostSessions.add(stale.client);
      await this.close(entry);
    }

    return this.getConnection(upstream, resolved);
  }

  async $onDestroy() {
    const entries = [...this.pools.values()].flatMap((pool) => [...pool.values()]);

    this.pools.clear();

    await Promise.all(entries.map((entry) => this.close(entry)));
  }

  /**
   * Returns the pool entry matching the resolved upstream definition and its connection, connecting lazily.
   */
  protected acquire(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings
  ): {entry: PoolEntry; connection: Promise<PlatformMcpUpstreamConnection>} {
    const pool = this.getPool(upstream);
    const key = this.getKey(resolved);
    const now = Date.now();
    let entry = pool.get(key);

    if (!entry) {
      entry = {lastUsed: now, pending: 0, failures: 0, retryAt: 0};
      pool.set(key, entry);
    }

    entry.lastUsed = now;
    this.evict(upstream, pool, entry, now);

    if (!entry.connection) {
      if (entry.retryAt > now) {
        return {entry, connection: Promise.reject(entry.error)};
      }

      entry.connection = this.connect(upstream, resolved, entry).catch((error) => {
        entry.connection = undefined;
        entry.failures++;
        entry.error = error;
        entry.retryAt = Date.now() + Math.min(1000 * 2 ** (entry.failures - 1), MAX_RETRY_DELAY);

        throw error;
      });
    }

    return {entry, connection: entry.connection};
  }

  protected async connect(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings,
    entry: PoolEntry
  ): Promise<PlatformMcpUpstreamConnection> {
    const {Client} = await import("@modelcontextprotocol/client");
    const transport = await createUpstreamTransport(resolved);
    const label = this.getLabel(resolved);
    let catalog: Promise<PlatformMcpUpstreamCatalog> | undefined;
    const invalidate = () => {
      catalog = undefined;
    };
    const listChanged = {autoRefresh: false, onChanged: invalidate};

    const client = new Client(
      {
        name: constant<string>("name") || "tsed-mcp-gateway",
        version: constant<string>("version") || "0.0.0"
      },
      {
        listChanged: {tools: listChanged, prompts: listChanged, resources: listChanged}
      }
    );

    entry.client = client;

    client.onclose = () => {
      // drop the connection so the next request reconnects
      if (entry.client === client) {
        entry.connection = undefined;
        entry.client = undefined;
      }
    };

    try {
      await client.connect(transport);
    } catch (error) {
      entry.client = undefined;
      await client.close().catch(() => undefined);

      throw error;
    }

    entry.failures = 0;

    return {
      client,
      getCatalog: () => {
        if (!catalog) {
          const pending: Promise<PlatformMcpUpstreamCatalog> = this.loadCatalog(client, label).then(
            ({catalog: loaded, complete}) => {
              // an incomplete catalog is served once and listed again on the next request
              if (!complete && catalog === pending) {
                catalog = undefined;
              }

              return loaded;
            },
            (error) => {
              if (catalog === pending) {
                catalog = undefined;
              }

              throw error;
            }
          );

          catalog = pending;
        }

        return catalog;
      },
      run: (fn) => this.run(upstream, resolved, entry, client, fn)
    };
  }

  protected async run<T>(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings,
    entry: PoolEntry,
    client: Client,
    fn: (client: Client) => Promise<T>,
    replay = true
  ): Promise<T> {
    if (entry.client !== client) {
      // the handler was attached before its connection was replaced (lost session) or closed (eviction)
      const acquired = this.acquire(upstream, resolved);

      entry = acquired.entry;
      // keeps the entry out of the eviction while it connects
      entry.pending++;

      try {
        client = (await acquired.connection).client;
      } finally {
        entry.pending--;
      }
    }

    // the client loses its transport once closed, by a concurrent request which saw the session lost
    const {transport} = client;

    entry.pending++;

    try {
      return await fn(client);
    } catch (error) {
      if (!replay || !(isUpstreamSessionLost(error, {transport}) || this.lostSessions.has(client))) {
        throw error;
      }
    } finally {
      entry.pending--;
      entry.lastUsed = Date.now();
    }

    // the upstream rejected the request without handling it: it can be replayed, once, on a new session
    await this.reconnect(upstream, resolved, {client});

    return this.run(upstream, resolved, entry, client, fn, false);
  }

  /**
   * Lists every catalog the upstream advertises.
   *
   * A listing that fails is logged and left empty so the others stay available: an upstream may advertise
   * a capability it cannot serve (e.g. prompts without any prompt configured). The catalog is then flagged
   * incomplete so the next request lists it again. It rejects only when every advertised listing fails.
   */
  protected async loadCatalog(client: Client, label: string): Promise<{catalog: PlatformMcpUpstreamCatalog; complete: boolean}> {
    const capabilities = client.getServerCapabilities() || {};
    const listings = [
      ["tools", capabilities.tools, (params: {cursor?: string}) => client.listTools(params)],
      ["resources", capabilities.resources, (params: {cursor?: string}) => client.listResources(params)],
      ["resourceTemplates", capabilities.resources, (params: {cursor?: string}) => client.listResourceTemplates(params)],
      ["prompts", capabilities.prompts, (params: {cursor?: string}) => client.listPrompts(params)]
    ] as const;

    const results = await Promise.allSettled(listings.map(([key, enabled, list]) => listAll(enabled, list, key)));
    const failures = results.flatMap((result, index) =>
      result.status === "rejected" ? [{key: listings[index][0], error: result.reason}] : []
    );
    const advertised = listings.filter(([, enabled]) => enabled).length;

    failures.forEach(({key, error}) => {
      logger().warn({
        event: "MCP_GATEWAY_CATALOG_ERROR",
        message: `MCP upstream "${label}": unable to list ${key}, they are skipped.`,
        error
      });
    });

    if (failures.length && failures.length === advertised) {
      throw failures[0].error;
    }

    const [tools, resources, resourceTemplates, prompts] = results.map((result) => (result.status === "fulfilled" ? result.value : []));

    return {
      catalog: {
        tools: tools as Tool[],
        resources: resources as Resource[],
        resourceTemplates: resourceTemplates as ResourceTemplateType[],
        prompts: prompts as Prompt[]
      },
      complete: !failures.length
    };
  }

  /**
   * Names the upstream in the logs without the credentials its URL may carry (userinfo, query, hash).
   */
  protected getLabel(upstream: PlatformMcpUpstreamSettings) {
    if (upstream.type === "stdio") {
      return upstream.command;
    }

    const {origin, pathname} = new URL(upstream.url);

    return `${origin}${pathname}`;
  }

  protected getPool(upstream: PlatformMcpUpstreamSettings) {
    let pool = this.pools.get(upstream);

    if (!pool) {
      pool = new Map();
      this.pools.set(upstream, pool);
    }

    return pool;
  }

  protected getKey(upstream: PlatformMcpUpstreamSettings) {
    const values = upstream.type === "stdio" ? [upstream.args, upstream.env] : [upstream.headers];

    return createHash("sha256").update(JSON.stringify(values)).digest("hex");
  }

  /**
   * Closes idle connections, then the least recently used ones while the pool is full.
   * Connections serving a request and the requested one are kept, so the pool can temporarily exceed `max`.
   */
  protected evict(upstream: PlatformMcpUpstreamSettings, pool: Map<string, PoolEntry>, current: PoolEntry, now: number) {
    const {max = DEFAULT_POOL_MAX, idleTimeout = DEFAULT_IDLE_TIMEOUT} = upstream.pool || {};

    if (pool.size <= 1) {
      // a single connection (static credentials, stdio) is kept alive
      return;
    }

    const entries = [...pool.entries()].sort(([, a], [, b]) => a.lastUsed - b.lastUsed);
    let size = entries.length;

    for (const [key, entry] of entries) {
      if (now - entry.lastUsed < idleTimeout && size <= max) {
        break;
      }

      if (entry.pending || entry === current) {
        // never close a connection that is serving a request, nor the one being requested
        continue;
      }

      size--;
      pool.delete(key);
      void this.close(entry);
    }
  }

  protected async close(entry: PoolEntry) {
    const {client} = entry;

    entry.client = undefined;
    entry.connection = undefined;

    try {
      await client?.close();
    } catch (error) {
      logger().warn({event: "MCP_GATEWAY_CLOSE_ERROR", error});
    }
  }
}

injectable(PlatformMcpGatewayService);
