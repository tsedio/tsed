import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {EventEmitter} from "node:events";
import {PlatformFastifyResponse} from "@tsed/platform-fastify";
import {PlatformMcpModule} from "./PlatformMcpModule.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {application} from "@tsed/platform-http";

const {createMcpServer, resolveMcpServerOptions} = vi.hoisted(() => ({
  createMcpServer: vi.fn(),
  resolveMcpServerOptions: vi.fn((settings) => ({...settings, tools: [], prompts: [], resources: []}))
}));

vi.mock("../../common/utils/createMcpServer.js", () => ({createMcpServer, resolveMcpServerOptions}));

const {TestTransport, transportInstances} = vi.hoisted(() => {
  const transportInstances: TestTransport[] = [];

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

function createModule() {
  const module = new PlatformMcpModule();
  const servers: Array<{connect: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>}> = [];

  createMcpServer.mockImplementation(() => {
    let transport: TestTransport | undefined;
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
    it("should register the MCP route only once", () => {
      const {module} = createModule();

      vi.spyOn(application(), "post").mockReturnValue(undefined as never);

      module.$onRoutesInit();
      module.$onRoutesInit();

      expect(application().post).toHaveBeenCalledTimes(1);
      expect(application().post).toHaveBeenCalledWith("/mcp", expect.any(Function));
      expect(resolveMcpServerOptions).toHaveBeenCalledOnce();
    });

    it("skips disabled settings without preventing enabled MCP servers from mounting", () => {
      const {module} = createModule();
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

  describe.each([
    ["express", createExpressContext],
    ["fastify", createFastifyContext]
  ])("dispatch() with %s", (_, createContext) => {
    it("should bind close on the low-level response and forward handleRequest", async () => {
      const {module, servers} = createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: []}, $ctx);

      const transport = transportInstances[0];

      expect(transport).toBeDefined();
      expect(servers[0].connect).toHaveBeenCalledWith(transport);
      expect(transport.handleRequest).toHaveBeenCalledWith($ctx.request.getReq(), res, $ctx.request.body);
      expect(createMcpServer).toHaveBeenCalledWith({tools: [], prompts: [], resources: []});
    });

    it("forwards the transport settings resolved for the MCP endpoint", async () => {
      const {module} = createModule();
      const {$ctx} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: [], transportOptions: {enableJsonResponse: false}}, $ctx);

      expect(transportInstances[0].options).toEqual({
        sessionIdGenerator: undefined,
        enableJsonResponse: false
      });
    });

    it("should close the request server when the low-level response closes", async () => {
      const {module, servers} = createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]({tools: [], prompts: [], resources: []}, $ctx);

      const transport = transportInstances[0];

      expect(servers[0].close).toHaveBeenCalledTimes(1);
      expect(transport.close).toHaveBeenCalledTimes(1);

      res.emit("close");

      expect(transport.close).toHaveBeenCalledTimes(1);
    });

    it("should resolve an isolated server for each request", async () => {
      const {module, servers} = createModule();
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
