import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {EventEmitter} from "node:events";
import {PlatformFastifyResponse} from "@tsed/platform-fastify";
import {PlatformMcpModule} from "./PlatformMcpModule.js";
import type {PlatformMcpAuthSettings} from "../../common/interfaces/PlatformMcpAuthSettings.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {application} from "@tsed/platform-http";
import {logger} from "@tsed/di";

const {createMcpServer, resolveMcpServerOptions} = vi.hoisted(() => ({
  createMcpServer: vi.fn(),
  resolveMcpServerOptions: vi.fn((settings) => ({...settings, tools: [], prompts: [], resources: []}))
}));

vi.mock("../../common/utils/createMcpServer.js", () => ({createMcpServer, resolveMcpServerOptions}));

type TestTransportInstance = {
  close: () => unknown;
  handleRequest: (...args: unknown[]) => Promise<unknown>;
  options: Record<string, unknown>;
};

const {TestTransport, transportInstances} = vi.hoisted(() => {
  const transportInstances: TestTransportInstance[] = [];

  class TestTransport {
    close = vi.fn().mockResolvedValue(undefined);
    handleRequest = vi.fn().mockResolvedValue(undefined);

    constructor(readonly options: Record<string, unknown>) {
      transportInstances.push(this);
    }
  }

  return {TestTransport, transportInstances};
});

vi.mock("@modelcontextprotocol/node", () => {
  return {
    NodeStreamableHTTPServerTransport: TestTransport
  };
});

async function createModule() {
  const module = await PlatformTest.invoke<PlatformMcpModule>(PlatformMcpModule);
  const servers: Array<{connect: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>}> = [];

  createMcpServer.mockImplementation(() => {
    let transport: TestTransportInstance | undefined;
    const server = {
      connect: vi.fn().mockImplementation((value) => {
        transport = value;
      }),
      close: vi.fn().mockImplementation(() => transport?.close())
    };

    servers.push(server);

    return server;
  });

  module["settings"] = {};

  return {module, servers};
}

function createExpressContext() {
  const $ctx = PlatformTest.createRequestContext();
  const res = new EventEmitter() as EventEmitter & {locals: Record<string, unknown>};

  res.locals = {};
  $ctx.response.getRes = vi.fn().mockReturnValue(res as never);

  return {$ctx, res};
}

function createFastifyContext() {
  const raw = new EventEmitter();
  const reply = Object.assign(PlatformTest.createResponse(), {
    raw,
    locals: {},
    code: vi.fn(),
    type: vi.fn(),
    header: vi.fn(),
    getHeader: vi.fn()
  });
  const $ctx = PlatformTest.createRequestContext({
    event: {
      response: reply
    },
    ResponseKlass: PlatformFastifyResponse
  });

  return {$ctx, res: raw};
}

describe("PlatformMcpModule", () => {
  beforeEach(() => {
    PlatformTest.create();
    transportInstances.length = 0;
  });

  afterEach(() => {
    PlatformTest.reset();
    vi.clearAllMocks();
    transportInstances.length = 0;
  });

  describe("$onRoutesInit()", () => {
    it("should register the MCP route only once", async () => {
      const {module} = await createModule();

      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      module.$onRoutesInit();
      module.$onRoutesInit();

      expect(application().post).toHaveBeenCalledTimes(1);
      expect(application().post).toHaveBeenCalledWith("/mcp", expect.any(Function));
      expect(resolveMcpServerOptions).toHaveBeenCalledOnce();
    });

    it("skips disabled settings without preventing enabled MCP servers from mounting", async () => {
      const {module} = await createModule();
      module["settings"] = [{path: "/first"}, {path: "/disabled", enabled: false}, {path: "/second"}];
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      module.$onRoutesInit();

      expect(application().post).toHaveBeenCalledTimes(2);
      expect(application().post).toHaveBeenNthCalledWith(1, "/first", expect.any(Function));
      expect(application().post).toHaveBeenNthCalledWith(2, "/second", expect.any(Function));
      expect(resolveMcpServerOptions).toHaveBeenCalledTimes(2);
      expect(module.$logRoutes([])).toEqual([
        {method: "POST", name: "PlatformMcpModule.dispatch()", url: "/first"},
        {method: "POST", name: "PlatformMcpModule.dispatch()", url: "/second"}
      ]);
    });
  });

  describe("upstream validation", () => {
    it("fails when the upstream uses identity placeholders without auth", async () => {
      const {module} = await createModule();
      module["settings"] = {upstream: {type: "http", url: "http://localhost/mcp", headers: {authorization: "Bearer ${OAUTH_TOKEN}"}}};
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      expect(() => module.$onRoutesInit()).toThrow("declares no auth");
      expect(application().post).not.toHaveBeenCalled();
    });

    it("fails when the introspection mode has no client credentials", async () => {
      const {module} = await createModule();
      module["settings"] = {auth: {issuer: "https://auth.example.com", resource: "https://api.example.com/mcp", mode: "introspection"}};
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      expect(() => module.$onRoutesInit()).toThrow("requires auth.clientId and auth.clientSecret");
    });

    it.each([
      ["auth.resource is required", {issuer: "https://auth.example.com"}],
      [
        "auth.audience cannot be disabled in offline mode",
        {issuer: "https://auth.example.com", resource: "https://api.example.com/mcp", audience: false}
      ],
      ["auth.issuer must be an absolute URL", {issuer: "auth.example.com", resource: "https://api.example.com/mcp"}],
      ["Issuer URL must be HTTPS", {issuer: "http://auth.example.com", resource: "https://api.example.com/mcp"}],
      ["auth.resource must be an absolute URL", {issuer: "https://auth.example.com", resource: "/mcp"}]
    ] as [string, Partial<PlatformMcpAuthSettings>][])("fails when %s", async (message, auth) => {
      const {module} = await createModule();
      module["settings"] = {auth: auth as PlatformMcpAuthSettings};
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      expect(() => module.$onRoutesInit()).toThrow(message);
    });

    it("warns when the audience check is disabled in introspection mode", async () => {
      const {module} = await createModule();
      module["settings"] = {
        auth: {
          issuer: "https://auth.example.com",
          resource: "https://api.example.com/mcp",
          clientId: "id",
          clientSecret: "secret",
          audience: false
        }
      };
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);
      vi.spyOn(application(), "get").mockReturnValue(undefined as never);
      vi.spyOn(logger(), "warn").mockReturnValue(undefined as never);

      module.$onRoutesInit();

      expect(logger().warn).toHaveBeenCalledWith(expect.objectContaining({event: "MCP_AUTH_AUDIENCE_DISABLED"}));
      expect(application().post).toHaveBeenCalledOnce();
    });

    it("registers the protected resource metadata route of protected endpoints", async () => {
      const {module} = await createModule();
      module["settings"] = {
        path: "/mcp/a",
        auth: {issuer: "https://auth.example.com", resource: "https://api.example.com/mcp/a", verifier: {verifyAccessToken: vi.fn()}}
      };
      vi.spyOn(application(), "post").mockReturnValue(undefined as never);
      vi.spyOn(application(), "get").mockReturnValue(undefined as never);

      module.$onRoutesInit();

      expect(application().get).toHaveBeenCalledWith("/.well-known/oauth-protected-resource/mcp/a", expect.any(Function));
      expect(module.$logRoutes([])).toEqual([
        {method: "GET", name: "PlatformMcpModule.metadata()", url: "/.well-known/oauth-protected-resource/mcp/a"},
        {method: "POST", name: "PlatformMcpModule.dispatch()", url: "/mcp/a"}
      ]);
    });
  });

  describe.each([
    ["express", createExpressContext],
    ["fastify", createFastifyContext]
  ])("dispatch() with %s", (_, createContext) => {
    it("should bind close on the low-level response and forward handleRequest", async () => {
      const {module, servers} = await createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: []}, $ctx);

      const transport = transportInstances[0];

      expect(transport).toBeDefined();
      expect(servers[0].connect).toHaveBeenCalledWith(transport);
      expect(transport.handleRequest).toHaveBeenCalledWith($ctx.request.getReq(), res, $ctx.request.body);
      expect(createMcpServer).toHaveBeenCalledWith({tools: [], prompts: [], resources: []});
    });

    it("forwards the transport settings resolved for the MCP endpoint", async () => {
      const {module} = await createModule();
      const {$ctx} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: [], transportOptions: {enableJsonResponse: false}}, $ctx);

      expect(transportInstances[0].options).toEqual({
        sessionIdGenerator: undefined,
        enableJsonResponse: false
      });
    });

    it("should close the request server after a JSON response", async () => {
      const {module, servers} = await createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: []}, $ctx);

      const transport = transportInstances[0];

      expect(servers[0].close).toHaveBeenCalledTimes(1);
      expect(transport.close).toHaveBeenCalledTimes(1);

      res.emit("close");

      expect(transport.close).toHaveBeenCalledTimes(1);
    });

    it("should close the request server when an SSE response closes", async () => {
      const {module, servers} = await createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: [], transportOptions: {enableJsonResponse: false}}, $ctx);

      expect(servers[0].close).not.toHaveBeenCalled();

      res.emit("close");

      expect(servers[0].close).toHaveBeenCalledOnce();
      expect(transportInstances[0].close).toHaveBeenCalledOnce();
    });

    it("should close the request server only once when the response closes during the request", async () => {
      const {module} = await createModule();
      const {$ctx, res} = createContext();
      const close = vi.fn();

      createMcpServer.mockImplementation(() => ({connect: vi.fn().mockImplementation(() => res.emit("close")), close}));

      await module["dispatch"]({tools: [], prompts: [], resources: []}, $ctx);

      expect(close).toHaveBeenCalledOnce();
    });

    it("should resolve an isolated server for each request", async () => {
      const {module, servers} = await createModule();
      const first = createContext();
      const second = createContext();

      await Promise.all([
        module["dispatch"]({tools: [], prompts: [], resources: []}, first.$ctx),
        module["dispatch"]({tools: [], prompts: [], resources: []}, second.$ctx)
      ]);

      expect(servers).toHaveLength(2);
      expect(servers[0]).not.toBe(servers[1]);
      expect(servers[0].connect).toHaveBeenCalledWith(transportInstances[0]);
      expect(servers[1].connect).toHaveBeenCalledWith(transportInstances[1]);
    });
  });
});
