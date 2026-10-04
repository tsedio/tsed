import {createHash} from "node:crypto";
import type {Client, Prompt, Resource, ResourceTemplateType, Tool} from "@modelcontextprotocol/client";
import {constant, injectable, logger, type OnDestroy} from "@tsed/di";
import type {PlatformMcpUpstreamSettings} from "../interfaces/PlatformMcpUpstreamSettings.js";
import {createUpstreamTransport} from "../utils/createUpstreamTransport.js";
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
   * Runs an upstream request, keeping the connection out of the pool eviction while it is pending.
   */
  run<T>(fn: () => Promise<T>): Promise<T>;
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
   * Returns the connection matching the resolved upstream definition, connecting lazily.
   *
   * @param upstream Upstream declared in the configuration, identifying the pool.
   * @param resolved Same definition with its placeholders interpolated for the caller.
   */
  getConnection(
    upstream: PlatformMcpUpstreamSettings,
    resolved: PlatformMcpUpstreamSettings = upstream
  ): Promise<PlatformMcpUpstreamConnection> {
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
        return Promise.reject(entry.error);
      }

      entry.connection = this.connect(resolved, entry).catch((error) => {
        entry.connection = undefined;
        entry.failures++;
        entry.error = error;
        entry.retryAt = Date.now() + Math.min(1000 * 2 ** (entry.failures - 1), MAX_RETRY_DELAY);

        throw error;
      });
    }

    return entry.connection;
  }

  async $onDestroy() {
    const entries = [...this.pools.values()].flatMap((pool) => [...pool.values()]);

    this.pools.clear();

    await Promise.all(entries.map((entry) => this.close(entry)));
  }

  protected async connect(upstream: PlatformMcpUpstreamSettings, entry: PoolEntry): Promise<PlatformMcpUpstreamConnection> {
    const {Client} = await import("@modelcontextprotocol/client");
    const transport = await createUpstreamTransport(upstream);
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
        catalog ||= this.loadCatalog(client).catch((error) => {
          catalog = undefined;

          throw error;
        });

        return catalog;
      },
      run: async (fn) => {
        entry.pending++;

        try {
          return await fn();
        } finally {
          entry.pending--;
          entry.lastUsed = Date.now();
        }
      }
    };
  }

  protected async loadCatalog(client: Client): Promise<PlatformMcpUpstreamCatalog> {
    const capabilities = client.getServerCapabilities() || {};

    const [tools, resources, resourceTemplates, prompts] = await Promise.all([
      listAll<Tool>(capabilities.tools, (params) => client.listTools(params), "tools"),
      listAll<Resource>(capabilities.resources, (params) => client.listResources(params), "resources"),
      listAll<ResourceTemplateType>(capabilities.resources, (params) => client.listResourceTemplates(params), "resourceTemplates"),
      listAll<Prompt>(capabilities.prompts, (params) => client.listPrompts(params), "prompts")
    ]);

    return {tools, resources, resourceTemplates, prompts};
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
