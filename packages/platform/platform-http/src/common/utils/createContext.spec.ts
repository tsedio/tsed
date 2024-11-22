import {configuration, injector} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {PlatformResponse} from "../services/PlatformResponse.js";
import {createContext} from "./createContext.js";

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
});
