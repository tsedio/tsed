import {EventEmitter} from "node:events";

import {PlatformFastifyResponse} from "@tsed/platform-fastify";
import {application} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {PlatformMcpModule} from "./PlatformMcpModule.js";

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

vi.mock("@modelcontextprotocol/sdk/server/streamableHttp.js", () => {
  return {
    StreamableHTTPServerTransport: TestTransport
  };
});

function createModule() {
  const module = new PlatformMcpModule();
  const server = {
    connect: vi.fn().mockResolvedValue(undefined)
  };

  module["settings"] = {};
  module["server"] = server as never;

  return {module, server};
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
    });
  });

  describe.each([
    ["express", createExpressContext],
    ["fastify", createFastifyContext]
  ])("dispatch() with %s", (_, createContext) => {
    it("should bind close on the low-level response and forward handleRequest", async () => {
      const {module, server} = createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]($ctx);

      const transport = transportInstances[0];

      expect(transport).toBeDefined();
      expect(server.connect).toHaveBeenCalledWith(transport);
      expect(transport.handleRequest).toHaveBeenCalledWith($ctx.request.getReq(), res, $ctx.request.body);
    });

    it("should close transport when the low-level response closes", async () => {
      const {module} = createModule();
      const {$ctx, res} = createContext();

      await module["dispatch"]($ctx);

      const transport = transportInstances[0];

      expect(transport.close).toHaveBeenCalledTimes(1);

      res.emit("close");

      expect(transport.close).toHaveBeenCalledTimes(1);
    });
  });
});
