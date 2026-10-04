import {DITest, inject, logger} from "@tsed/di";
import type {McpUpstreamSettings} from "../interfaces/McpUpstreamSettings.js";
import {PlatformMcpGatewayService, type PlatformMcpUpstreamCatalog} from "../services/PlatformMcpGatewayService.js";
import {attachUpstream} from "./attachUpstream.js";
import type {CreateMcpServerOpts} from "./createMcpServer.js";

const authInfo = {token: "abc", clientId: "client", scopes: ["mcp:read"]};

function createCatalog(catalog: Partial<PlatformMcpUpstreamCatalog> = {}): PlatformMcpUpstreamCatalog {
  return {
    tools: [
      {
        name: "echo",
        description: "Echo",
        inputSchema: {type: "object", properties: {message: {type: "string"}}},
        outputSchema: {type: "object", properties: {message: {type: "string"}}}
      },
      {name: "delete", inputSchema: {type: "object"}}
    ],
    resources: [{name: "readme", uri: "upstream://readme", mimeType: "text/plain"}],
    resourceTemplates: [{name: "doc", uriTemplate: "upstream://docs/{id}"}],
    prompts: [
      {name: "greet", description: "Greet", arguments: [{name: "who", description: "Name", required: true}, {name: "lang"}]},
      {name: "plain"}
    ],
    ...catalog
  } as PlatformMcpUpstreamCatalog;
}

function createSettings(upstream?: McpUpstreamSettings, opts: Partial<CreateMcpServerOpts> = {}): CreateMcpServerOpts {
  return {path: "/mcp/gateway", tools: [], prompts: [], resources: [], upstream, ...opts};
}

function createContext(meta?: Record<string, unknown>) {
  return {mcpReq: {signal: new AbortController().signal, _meta: meta, notify: vi.fn()}};
}

function setup(catalog = createCatalog()) {
  const client = {
    callTool: vi.fn().mockResolvedValue({content: []}),
    readResource: vi.fn().mockResolvedValue({contents: []}),
    getPrompt: vi.fn().mockResolvedValue({messages: []})
  };
  const connection = {client, getCatalog: vi.fn().mockResolvedValue(catalog), run: vi.fn((fn: () => unknown) => fn())};
  const server = {registerTool: vi.fn(), registerResource: vi.fn(), registerPrompt: vi.fn()};
  const getConnection = vi.spyOn(inject(PlatformMcpGatewayService), "getConnection").mockResolvedValue(connection as never);

  const getHandler = (method: keyof typeof server, name: string) => server[method].mock.calls.find(([key]) => key === name)!.at(-1);

  return {client, connection, server, getConnection, getHandler};
}

const http: McpUpstreamSettings = {type: "http", url: "https://upstream.example.com/mcp"};

describe("attachUpstream()", () => {
  beforeEach(() => {
    DITest.create();
    vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);
    vi.spyOn(logger(), "error").mockReturnValue(undefined as never);
  });
  afterEach(() => {
    vi.restoreAllMocks();

    return DITest.reset();
  });

  it("does nothing when the endpoint has no upstream", async () => {
    const {server, getConnection} = setup();

    await attachUpstream(server as never, createSettings());

    expect(getConnection).not.toHaveBeenCalled();
    expect(server.registerTool).not.toHaveBeenCalled();
  });

  it("connects with the upstream interpolated for the caller", async () => {
    const {server, getConnection} = setup();
    const upstream: McpUpstreamSettings = {...http, headers: {authorization: "Bearer ${OAUTH_TOKEN}"}};

    await attachUpstream(server as never, createSettings(upstream), authInfo);

    expect(getConnection).toHaveBeenCalledExactlyOnceWith(upstream, {...upstream, headers: {authorization: "Bearer abc"}});
  });

  describe("tools", () => {
    it("registers the upstream tools with their schemas and forwards calls", async () => {
      const {server, client, connection, getHandler} = setup();
      const ctx = createContext();

      await attachUpstream(server as never, createSettings(http));

      expect(server.registerTool.mock.calls.map(([name]) => name)).toEqual(["echo", "delete"]);
      expect(server.registerTool).toHaveBeenCalledWith(
        "echo",
        {description: "Echo", inputSchema: expect.anything(), outputSchema: expect.anything()},
        expect.any(Function)
      );
      expect(server.registerTool.mock.calls[1][1]).not.toHaveProperty("outputSchema");

      await getHandler("registerTool", "echo")({message: "hi"}, ctx);

      expect(connection.run).toHaveBeenCalledOnce();
      expect(client.callTool).toHaveBeenCalledExactlyOnceWith({name: "echo", arguments: {message: "hi"}}, {signal: ctx.mcpReq.signal});
    });

    it("applies the prefix and the filters, and calls the upstream with the original name", async () => {
      const {server, client, getHandler} = setup();
      const upstream: McpUpstreamSettings = {...http, prefix: "up_", tools: {include: [/^e/, "delete"], exclude: ["delete"]}};

      await attachUpstream(server as never, createSettings(upstream));

      expect(server.registerTool.mock.calls.map(([name]) => name)).toEqual(["up_echo"]);

      await getHandler("registerTool", "up_echo")({}, createContext());

      expect(client.callTool).toHaveBeenCalledWith({name: "echo", arguments: {}}, expect.anything());
    });

    it("matches global and sticky patterns consistently across requests", async () => {
      const upstream: McpUpstreamSettings = {...http, tools: {include: [/^echo/g], exclude: [/^delete/y]}};

      for (let attempt = 0; attempt < 3; attempt++) {
        const {server} = setup();

        await attachUpstream(server as never, createSettings(upstream));

        expect(server.registerTool.mock.calls.map(([name]) => name)).toEqual(["echo"]);
      }
    });

    it("forwards the upstream progress notifications when the caller asked for them", async () => {
      const {server, client, getHandler} = setup();
      const ctx = createContext({progressToken: "token-1"});

      await attachUpstream(server as never, createSettings(http));
      await getHandler("registerTool", "echo")({}, ctx);

      const {onprogress} = client.callTool.mock.calls[0][1];

      onprogress({progress: 1, total: 2});

      expect(ctx.mcpReq.notify).toHaveBeenCalledExactlyOnceWith({
        method: "notifications/progress",
        params: {progress: 1, total: 2, progressToken: "token-1"}
      });
    });

    it("compiles each upstream schema once across requests", async () => {
      const catalog = createCatalog();
      const first = setup(catalog);

      await attachUpstream(first.server as never, createSettings(http));

      const second = setup(catalog);

      await attachUpstream(second.server as never, createSettings(http));

      expect(second.server.registerTool.mock.calls[0][1].inputSchema).toBe(first.server.registerTool.mock.calls[0][1].inputSchema);
    });

    it("keeps the local tool and warns when an upstream tool has the same name", async () => {
      const {server} = setup();

      await attachUpstream(server as never, createSettings(http, {tools: [{name: "echo"}] as never}));

      expect(server.registerTool.mock.calls.map(([name]) => name)).toEqual(["delete"]);
      expect(logger().warn).toHaveBeenCalledWith({
        event: "MCP_GATEWAY_COLLISION",
        message: 'MCP upstream "/mcp/gateway": tool "echo" is already registered and is skipped.'
      });
    });

    it("skips an upstream tool that cannot be registered", async () => {
      const {server} = setup();
      const error = new Error("invalid schema");

      server.registerTool.mockImplementationOnce(() => {
        throw error;
      });

      await attachUpstream(server as never, createSettings(http));

      expect(server.registerTool).toHaveBeenCalledTimes(2);
      expect(logger().warn).toHaveBeenCalledWith({
        event: "MCP_GATEWAY_REGISTER_ERROR",
        message: 'MCP upstream "/mcp/gateway": unable to register tool "echo".',
        error
      });
    });
  });

  describe("resources", () => {
    it("registers the upstream resources and forwards reads", async () => {
      const {server, client, getHandler} = setup();
      const ctx = createContext();

      await attachUpstream(server as never, createSettings(http));

      expect(server.registerResource).toHaveBeenCalledWith("readme", "upstream://readme", {mimeType: "text/plain"}, expect.any(Function));

      await getHandler("registerResource", "readme")(new URL("upstream://readme"), ctx);

      expect(client.readResource).toHaveBeenCalledExactlyOnceWith({uri: "upstream://readme"}, {signal: ctx.mcpReq.signal});
    });

    it("registers the upstream resource templates and forwards the requested URI", async () => {
      const {server, client, getHandler} = setup();

      await attachUpstream(server as never, createSettings(http));
      await getHandler("registerResource", "doc")(new URL("upstream://docs/42"), {id: "42"}, createContext());

      expect(client.readResource).toHaveBeenCalledWith({uri: "upstream://docs/42"}, expect.anything());
    });

    it("skips an upstream resource template named like a local one", async () => {
      const {server} = setup();

      await attachUpstream(server as never, createSettings(http, {resources: [{name: "doc", template: {}}] as never}));

      expect(server.registerResource.mock.calls.map(([name]) => name)).toEqual(["readme"]);
      expect(logger().warn).toHaveBeenCalledWith(expect.objectContaining({event: "MCP_GATEWAY_COLLISION"}));
    });

    it("filters resources and templates on their URI, and skips URIs declared locally", async () => {
      const {server} = setup(
        createCatalog({
          resources: [
            {name: "readme", uri: "upstream://readme"},
            {name: "secret", uri: "upstream://secret"},
            {name: "local", uri: "tsed://local"}
          ]
        } as never)
      );
      const upstream: McpUpstreamSettings = {...http, resources: {exclude: ["upstream://secret", /docs/]}};

      await attachUpstream(server as never, createSettings(upstream, {resources: [{name: "local", uri: "tsed://local"}] as never}));

      expect(server.registerResource.mock.calls.map(([name]) => name)).toEqual(["readme"]);
    });
  });

  describe("prompts", () => {
    it("registers the upstream prompts with an arguments schema and forwards them", async () => {
      const {server, client, getHandler} = setup();
      const ctx = createContext();

      await attachUpstream(server as never, createSettings({...http, prefix: "up_"}));

      expect(server.registerPrompt).toHaveBeenCalledWith(
        "up_greet",
        {description: "Greet", argsSchema: expect.anything()},
        expect.any(Function)
      );

      await getHandler("registerPrompt", "up_greet")({who: "Ts.ED"}, ctx);

      expect(client.getPrompt).toHaveBeenCalledExactlyOnceWith({name: "greet", arguments: {who: "Ts.ED"}}, {signal: ctx.mcpReq.signal});
    });

    it("registers a prompt without arguments", async () => {
      const {server, client, getHandler} = setup();

      await attachUpstream(server as never, createSettings(http));

      expect(server.registerPrompt).toHaveBeenCalledWith("plain", {}, expect.any(Function));

      await getHandler("registerPrompt", "plain")(createContext());

      expect(client.getPrompt).toHaveBeenCalledWith({name: "plain", arguments: undefined}, expect.anything());
    });
  });

  describe("unavailable upstream", () => {
    it.each([
      ["the endpoint path", createSettings(http), "/mcp/gateway"],
      ["the upstream URL", createSettings(http, {path: undefined}), "https://upstream.example.com/mcp"],
      ["the stdio command", createSettings({type: "stdio", command: "npx"}, {path: undefined}), "npx"]
    ])("logs the failure with %s and keeps the server usable", async (_, settings, label) => {
      const {server, getConnection} = setup();
      const error = new Error("connect ECONNREFUSED");

      getConnection.mockRejectedValue(error);

      await expect(attachUpstream(server as never, settings)).resolves.toBeUndefined();

      expect(server.registerTool).not.toHaveBeenCalled();
      expect(logger().error).toHaveBeenCalledWith({
        event: "MCP_GATEWAY_UPSTREAM_ERROR",
        message: `MCP upstream "${label}" is unavailable.`,
        error
      });
    });

    it("logs a catalog failure", async () => {
      const {server, connection} = setup();

      connection.getCatalog.mockRejectedValue(new Error("list failed"));

      await attachUpstream(server as never, createSettings(http));

      expect(server.registerTool).not.toHaveBeenCalled();
      expect(logger().error).toHaveBeenCalledWith(expect.objectContaining({event: "MCP_GATEWAY_UPSTREAM_ERROR"}));
    });
  });
});
