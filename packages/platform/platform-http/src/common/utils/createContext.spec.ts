import {configuration, injector, logger} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {PlatformResponse} from "../services/PlatformResponse.js";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createContext, createRequestId, defaultReqIdBuilder} from "./createContext.js";

vi.mock("@tsed/hooks", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tsed/hooks")>();
  return {
    ...mod,
    $asyncEmit: vi.fn()
  };
});

async function createContextFixture(reqOpts?: any) {
  const request = PlatformTest.createRequest(reqOpts);
  const response = PlatformTest.createResponse();

  configuration().logger.level = "info";
  configuration().logger.ignoreUrlPatterns = ["/admin", /\/admin2/];

  const invoke = createContext();
  const ctx = await invoke({request, response});
  ctx.response.getRes().on = vi.fn();

  ctx.response.onEnd(() => ctx.finish());

  const call = async () => {
    await ctx.start();

    ctx.logger.info({event: "test"});
    ctx.logger.flush();
  };

  return {call, injector: injector(), request, response, ctx};
}

describe("createContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("should create context and attach it to the request", async () => {
    // GIVEN
    const {injector, ctx, call} = await createContextFixture();

    vi.mocked($asyncEmit).mockResolvedValue(undefined);
    vi.spyOn(injector.logger, "info").mockReturnValue(undefined);

    // WHEN
    await call();

    // THEN
    expect($asyncEmit).toHaveBeenCalledWith("$onRequest", [ctx]);

    await vi.mocked(ctx.response.getRes().on).mock.calls[0][1](ctx);

    expect($asyncEmit).toHaveBeenCalledWith("$onResponse", [ctx]);
    expect(ctx.isFinished()).toEqual(true);
  });

  it("should ignore logs", async () => {
    // GIVEN
    const {injector, call} = await createContextFixture({
      url: "/admin",
      originalUrl: "/admin"
    });

    vi.mocked($asyncEmit).mockResolvedValue(undefined);
    vi.spyOn(injector.logger, "info").mockReturnValue(undefined);

    // WHEN
    await call();

    // THEN
    expect(injector.logger.info).toHaveBeenCalledTimes(0);
  });

  it("should add a x-request-id header to the response", async () => {
    // GIVEN
    vi.spyOn(PlatformResponse.prototype, "setHeader");
    vi.spyOn(logger(), "info").mockReturnValue(undefined);

    const {ctx, response, request, call} = await createContextFixture();
    response.req = request;

    // WHEN
    await call();

    // THEN
    expect(ctx.response.setHeader).toHaveBeenCalledWith("x-request-id", expect.any(String));
  });

  it("should use an existing x-request-id request header for the response x-request-id header", async () => {
    // GIVEN
    vi.spyOn(PlatformResponse.prototype, "setHeader");
    vi.spyOn(logger(), "info").mockReturnValue(undefined);

    const {ctx, response, request, call} = await createContextFixture({
      headers: {
        "x-request-id": "test-id"
      }
    });
    response.req = request;

    // WHEN
    await call();

    // THEN
    expect(ctx.response.setHeader).toHaveBeenCalledWith("x-request-id", "test-id");
  });

  describe("defaultReqIdBuilder()", () => {
    it("should create a 32 hex chars id when the request has no x-request-id header", () => {
      expect(defaultReqIdBuilder({get: () => undefined})).toMatch(/^[0-9a-f]{32}$/);
      expect(defaultReqIdBuilder({headers: {}})).toMatch(/^[0-9a-f]{32}$/);
    });

    it("should read the header with get() on an Express or Koa request", () => {
      expect(defaultReqIdBuilder({get: (name: string) => (name === "x-request-id" ? "express-id" : undefined)})).toEqual("express-id");
    });

    it("should read the header from headers on a request without get() (Fastify)", () => {
      expect(defaultReqIdBuilder({headers: {"x-request-id": "fastify-id"}})).toEqual("fastify-id");
    });
  });

  describe("createRequestId()", () => {
    it("should create a uuid v4 without dashes", () => {
      const id = createRequestId();

      expect(id).toMatch(/^[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}$/);
      expect(createRequestId()).not.toEqual(id);
    });
  });
});
