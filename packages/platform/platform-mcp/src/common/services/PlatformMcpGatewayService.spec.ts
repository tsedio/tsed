import {type Client, InMemoryTransport, SdkErrorCode, SdkHttpError} from "@modelcontextprotocol/client";
import {McpServer, ResourceTemplate} from "@modelcontextprotocol/server";
import {DITest, inject, logger} from "@tsed/di";
import type {PlatformMcpUpstreamSettings} from "../interfaces/PlatformMcpUpstreamSettings.js";
import {PlatformMcpGatewayService} from "./PlatformMcpGatewayService.js";

const {createUpstreamTransport} = vi.hoisted(() => ({createUpstreamTransport: vi.fn()}));

vi.mock("../utils/createUpstreamTransport.js", () => ({createUpstreamTransport}));

function withHeaders(upstream: PlatformMcpUpstreamSettings, headers: Record<string, string>) {
  return {...upstream, headers} as PlatformMcpUpstreamSettings;
}

function createUpstream(opts: Partial<PlatformMcpUpstreamSettings> = {}): PlatformMcpUpstreamSettings {
  return {type: "http", url: "http://localhost/mcp", ...opts} as PlatformMcpUpstreamSettings;
}

function mockUpstreamServers() {
  const servers: McpServer[] = [];

  createUpstreamTransport.mockImplementation(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const server = new McpServer({name: "upstream", version: "1.0.0"});

    server.registerTool("first", {description: "First tool"}, () => ({content: []}));
    servers.push(server);

    await server.connect(serverTransport);

    return clientTransport;
  });

  return servers;
}

/**
 * Session given by the upstream on initialize (Streamable HTTP), kept by the client on every request.
 */
function setSession(client: Client, sessionId = "upstream-session") {
  (client.transport as {sessionId?: string}).sessionId = sessionId;
}

/**
 * What the MCP client throws when the upstream no longer knows its session (restarted, closed the session).
 */
function sessionNotFound(status = 404) {
  const text = '{"jsonrpc":"2.0","id":null,"error":{"code":-32001,"message":"Session not found"}}';

  return new SdkHttpError(SdkErrorCode.ClientHttpNotImplemented, `Error POSTing to endpoint: ${text}`, {
    status,
    statusText: "Not Found",
    text
  });
}

describe("PlatformMcpGatewayService", () => {
  beforeEach(() => DITest.create());
  afterEach(async () => {
    vi.useRealTimers();
    vi.resetAllMocks();
    await DITest.reset();
  });

  it("connects lazily and reuses the connection for the same headers", async () => {
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream();

    const [first, second] = await Promise.all([
      service.getConnection(upstream, withHeaders(upstream, {"x-api-key": "a"})),
      service.getConnection(upstream, withHeaders(upstream, {"x-api-key": "a"}))
    ]);

    expect(first).toBe(second);
    expect(createUpstreamTransport).toHaveBeenCalledExactlyOnceWith(withHeaders(upstream, {"x-api-key": "a"}));
  });

  it("opens one connection per distinct set of headers", async () => {
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream();

    const first = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    const second = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));

    expect(first).not.toBe(second);
    expect(createUpstreamTransport).toHaveBeenCalledTimes(2);
  });

  it("loads and caches the upstream catalog", async () => {
    mockUpstreamServers();

    const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());
    const listTools = vi.spyOn(connection.client, "listTools");

    const catalog = await connection.getCatalog();

    expect(catalog.tools.map(({name}) => name)).toEqual(["first"]);
    expect(catalog).toMatchObject({resources: [], resourceTemplates: [], prompts: []});
    expect(await connection.getCatalog()).toBe(catalog);
    expect(listTools).toHaveBeenCalledOnce();
  });

  it("loads the resources, resource templates and prompts advertised by the upstream", async () => {
    createUpstreamTransport.mockImplementation(async () => {
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
      const server = new McpServer({name: "upstream", version: "1.0.0"});

      server.registerResource("readme", "upstream://readme", {}, (uri) => ({contents: [{uri: uri.href, text: "readme"}]}));
      server.registerResource("doc", new ResourceTemplate("upstream://docs/{id}", {list: undefined}), {}, (uri) => ({
        contents: [{uri: uri.href, text: "doc"}]
      }));
      server.registerPrompt("greet", {description: "Greet"}, () => ({messages: []}));

      await server.connect(serverTransport);

      return clientTransport;
    });

    const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());

    await expect(connection.getCatalog()).resolves.toMatchObject({
      tools: [],
      resources: [{name: "readme", uri: "upstream://readme"}],
      resourceTemplates: [{name: "doc", uriTemplate: "upstream://docs/{id}"}],
      prompts: [{name: "greet", description: "Greet"}]
    });
  });

  it("retries the catalog after a listing failure", async () => {
    mockUpstreamServers();

    const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());
    const listTools = vi.spyOn(connection.client, "listTools").mockRejectedValueOnce(new Error("list failed"));

    await expect(connection.getCatalog()).rejects.toThrow("list failed");
    await expect(connection.getCatalog()).resolves.toMatchObject({tools: [expect.objectContaining({name: "first"})]});
    expect(listTools).toHaveBeenCalledTimes(2);
  });

  it("keeps the other listings when an advertised listing fails, and lists it again on the next request", async () => {
    createUpstreamTransport.mockImplementation(async () => {
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
      const server = new McpServer({name: "upstream", version: "1.0.0"});

      server.registerTool("first", {description: "First tool"}, () => ({content: []}));
      server.registerPrompt("greet", {description: "Greet"}, () => ({messages: []}));

      await server.connect(serverTransport);

      return clientTransport;
    });
    vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

    const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());
    const error = new Error("A prompts collection must be set in settings");
    const listPrompts = vi.spyOn(connection.client, "listPrompts").mockRejectedValueOnce(error);

    await expect(connection.getCatalog()).resolves.toMatchObject({tools: [{name: "first"}], prompts: []});
    expect(logger().warn).toHaveBeenCalledWith({
      event: "MCP_GATEWAY_CATALOG_ERROR",
      message: 'MCP upstream "http://localhost/mcp": unable to list prompts, they are skipped.',
      error
    });

    await expect(connection.getCatalog()).resolves.toMatchObject({tools: [{name: "first"}], prompts: [{name: "greet"}]});
    expect(listPrompts).toHaveBeenCalledTimes(2);
  });

  it("rejects the catalog when every advertised listing fails", async () => {
    createUpstreamTransport.mockImplementation(async () => {
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
      const server = new McpServer({name: "upstream", version: "1.0.0"});

      server.registerTool("first", {description: "First tool"}, () => ({content: []}));
      server.registerPrompt("greet", {description: "Greet"}, () => ({messages: []}));

      await server.connect(serverTransport);

      return clientTransport;
    });

    vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

    const upstream = createUpstream({url: "https://user:secret@localhost/mcp?token=secret#hash"});
    const connection = await inject(PlatformMcpGatewayService).getConnection(upstream);

    vi.spyOn(connection.client, "listTools").mockRejectedValueOnce(new Error("tools failed"));
    vi.spyOn(connection.client, "listPrompts").mockRejectedValueOnce(new Error("prompts failed"));

    await expect(connection.getCatalog()).rejects.toThrow("tools failed");
    // every failure is logged, and the label carries no credential of the URL
    expect(vi.mocked(logger().warn).mock.calls.map(([log]) => (log as any).message)).toEqual([
      'MCP upstream "https://localhost/mcp": unable to list tools, they are skipped.',
      'MCP upstream "https://localhost/mcp": unable to list prompts, they are skipped.'
    ]);
  });

  it("refreshes the catalog when the upstream notifies a list change", async () => {
    const servers = mockUpstreamServers();
    const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());

    await connection.getCatalog();

    servers[0].registerTool("second", {description: "Second tool"}, () => ({content: []}));

    await vi.waitFor(async () => {
      expect((await connection.getCatalog()).tools.map(({name}) => name)).toEqual(["first", "second"]);
    });
  });

  it("reconnects after the upstream connection is closed", async () => {
    const servers = mockUpstreamServers();
    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream();
    const first = await service.getConnection(upstream);

    await servers[0].close();

    await vi.waitFor(async () => {
      expect(await service.getConnection(upstream)).not.toBe(first);
    });
  });

  describe("when the upstream lost the session", () => {
    beforeEach(() => {
      vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);
    });

    it("reconnects and replays the request", async () => {
      mockUpstreamServers();

      const service = inject(PlatformMcpGatewayService);
      const upstream = createUpstream();
      const stale = await service.getConnection(upstream);
      const close = vi.spyOn(stale.client, "close");

      setSession(stale.client);

      const result = await stale.run((client) =>
        client === stale.client ? Promise.reject(sessionNotFound()) : client.callTool({name: "first", arguments: {}})
      );

      expect(result).toEqual({content: []});
      expect(close).toHaveBeenCalledOnce();
      expect(createUpstreamTransport).toHaveBeenCalledTimes(2);
      expect(await service.getConnection(upstream)).not.toBe(stale);
      expect(logger().warn).toHaveBeenCalledWith({
        event: "MCP_GATEWAY_SESSION_LOST",
        message: 'MCP upstream "http://localhost/mcp": the upstream lost the session, reconnecting.'
      });
    });

    it("runs a handler attached before the reconnection on the new connection", async () => {
      mockUpstreamServers();

      const service = inject(PlatformMcpGatewayService);
      const upstream = createUpstream();
      // two requests attached the same connection, the first one replaces it
      const stale = await service.getConnection(upstream);

      setSession(stale.client);

      await stale.run((client) => (client === stale.client ? Promise.reject(sessionNotFound()) : Promise.resolve()));

      const client = await stale.run((client) => Promise.resolve(client));

      expect(client).not.toBe(stale.client);
      expect(client).toBe((await service.getConnection(upstream)).client);
      expect(createUpstreamTransport).toHaveBeenCalledTimes(2);
    });

    it("runs a handler on a new connection when its connection was evicted", async () => {
      vi.useFakeTimers();
      mockUpstreamServers();

      const service = inject(PlatformMcpGatewayService);
      const upstream = createUpstream({pool: {idleTimeout: 1000}});
      const evicted = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));

      vi.advanceTimersByTime(1001);
      await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));

      const client = await evicted.run((client) => Promise.resolve(client));

      expect(client).not.toBe(evicted.client);
      expect(createUpstreamTransport).toHaveBeenCalledTimes(3);
    });

    it("replays the request only once", async () => {
      mockUpstreamServers();

      const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());
      const fn = vi.fn((client: Client) => {
        setSession(client);

        return Promise.reject(sessionNotFound());
      });

      setSession(connection.client);

      await expect(connection.run(fn)).rejects.toThrow("Session not found");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(createUpstreamTransport).toHaveBeenCalledTimes(2);
    });

    it("opens a single connection for the requests failing together", async () => {
      mockUpstreamServers();

      const service = inject(PlatformMcpGatewayService);
      const upstream = createUpstream();
      const stale = await service.getConnection(upstream);
      const fn = (client: Client) => (client === stale.client ? Promise.reject(sessionNotFound()) : Promise.resolve(client));

      setSession(stale.client);

      const [first, second] = await Promise.all([stale.run(fn), stale.run(fn)]);

      expect(first).toBe(second);
      expect(createUpstreamTransport).toHaveBeenCalledTimes(2);
    });

    it("keeps the connection on another error", async () => {
      mockUpstreamServers();

      const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());

      setSession(connection.client);

      await expect(connection.run(() => Promise.reject(sessionNotFound(500)))).rejects.toThrow("Session not found");
      expect(createUpstreamTransport).toHaveBeenCalledOnce();
    });

    it("keeps the connection on a 404 of an upstream without session", async () => {
      mockUpstreamServers();

      const connection = await inject(PlatformMcpGatewayService).getConnection(createUpstream());

      await expect(connection.run(() => Promise.reject(sessionNotFound()))).rejects.toThrow("Session not found");
      expect(createUpstreamTransport).toHaveBeenCalledOnce();
    });
  });

  it("backs off before retrying a failing upstream", async () => {
    vi.useFakeTimers();
    createUpstreamTransport.mockRejectedValue(new Error("connect ECONNREFUSED"));

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream();

    await expect(service.getConnection(upstream)).rejects.toThrow("ECONNREFUSED");
    await expect(service.getConnection(upstream)).rejects.toThrow("ECONNREFUSED");

    expect(createUpstreamTransport).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(1001);
    mockUpstreamServers();

    await expect(service.getConnection(upstream)).resolves.toBeDefined();
  });

  it("closes the least recently used connection when the pool is full", async () => {
    vi.useFakeTimers();
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream({pool: {max: 2}});

    const first = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    const close = vi.spyOn(first.client, "close");

    vi.advanceTimersByTime(10);
    await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));
    vi.advanceTimersByTime(10);
    await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer c"}));

    expect(close).toHaveBeenCalledOnce();
  });

  it("keeps a connection that is serving a request", async () => {
    vi.useFakeTimers();
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream({pool: {idleTimeout: 1000}});
    const first = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    const close = vi.spyOn(first.client, "close");
    let release!: () => void;
    const pending = first.run(() => new Promise<void>((resolve) => (release = resolve)));

    vi.advanceTimersByTime(1001);
    await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));

    expect(close).not.toHaveBeenCalled();

    release();
    await pending;
    vi.advanceTimersByTime(1001);
    await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));

    expect(close).toHaveBeenCalledOnce();
  });

  it("keeps the requested connection tracked when the pool is full of busy connections", async () => {
    vi.useFakeTimers();
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream({pool: {max: 1}});
    const busy = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    let release!: () => void;
    const pending = busy.run(() => new Promise<void>((resolve) => (release = resolve)));

    vi.advanceTimersByTime(10);

    const added = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));
    const close = vi.spyOn(added.client, "close");

    // the pool temporarily exceeds `max`: the new connection is reused and closed with the application
    expect(await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}))).toBe(added);
    expect(createUpstreamTransport).toHaveBeenCalledTimes(2);

    release();
    await pending;
    await service.$onDestroy();

    expect(close).toHaveBeenCalledOnce();
  });

  it("closes idle connections", async () => {
    vi.useFakeTimers();
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream({pool: {idleTimeout: 1000}});

    const first = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    const close = vi.spyOn(first.client, "close");

    vi.advanceTimersByTime(1001);
    await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));

    expect(close).toHaveBeenCalledOnce();
  });

  it("logs a client that fails to close and keeps destroying the others", async () => {
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const upstream = createUpstream();
    const first = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer a"}));
    const second = await service.getConnection(upstream, withHeaders(upstream, {authorization: "Bearer b"}));
    const error = new Error("close failed");
    const close = vi.spyOn(second.client, "close");

    vi.spyOn(first.client, "close").mockRejectedValue(error);
    vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

    await expect(service.$onDestroy()).resolves.toBeUndefined();

    expect(logger().warn).toHaveBeenCalledWith({event: "MCP_GATEWAY_CLOSE_ERROR", error});
    expect(close).toHaveBeenCalledOnce();
  });

  it("closes every upstream client when the application is destroyed", async () => {
    mockUpstreamServers();

    const service = inject(PlatformMcpGatewayService);
    const connection = await service.getConnection(createUpstream());
    const close = vi.spyOn(connection.client, "close");

    await service.$onDestroy();

    expect(close).toHaveBeenCalledOnce();
  });
});
