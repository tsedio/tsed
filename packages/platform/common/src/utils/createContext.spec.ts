import {PlatformResponse} from "../services/PlatformResponse";
import {PlatformTest} from "../services/PlatformTest";
import {createContext} from "./createContext";

async function createContextFixture(reqOpts?: any) {
  const injector = PlatformTest.injector;
  const request = PlatformTest.createRequest(reqOpts);
  const response = PlatformTest.createResponse();

  injector.settings.logger.level = "info";
  injector.settings.logger.ignoreUrlPatterns = ["/admin", /\/admin2/];

  const invoke = createContext(injector);
  const ctx = await invoke({request, response});
  ctx.response.getRes().on = jest.fn();

  ctx.response.onEnd(() => ctx.finish());

  const call = async () => {
    await ctx.start();

    ctx.logger.info({event: "test"});
    ctx.logger.flush();
  };

  return {call, injector, request, response, ctx};
}

describe("createContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  it("should create context and attach it to the request", async () => {
    // GIVEN
    const {injector, ctx, call} = await createContextFixture();

    jest.spyOn(injector, "emit").mockResolvedValue(undefined);
    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);

    // WHEN
    await call();

    // THEN
    expect(injector.emit).toBeCalledWith("$onRequest", ctx);

    await (ctx.response.getRes().on as jest.Mock).mock.calls[0][1](ctx);

    expect(injector.emit).toBeCalledWith("$onResponse", ctx);
  });

  it("should ignore logs", async () => {
    // GIVEN
    const {injector, call} = await createContextFixture({
      url: "/admin",
      originalUrl: "/admin"
    });

    jest.spyOn(injector, "emit").mockResolvedValue(undefined);
    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);

    // WHEN
    await call();

    // THEN
    expect(injector.logger.info).toHaveBeenCalledTimes(0);
  });

  it("should add a x-request-id header to the response", async () => {
    // GIVEN
    jest.spyOn(PlatformResponse.prototype, "setHeader");

    const {ctx, response, request, call} = await createContextFixture();
    response.req = request;

    // WHEN
    await call();

    // THEN
    expect(ctx.response.setHeader).toBeCalledWith("x-request-id", expect.any(String));
  });

  it("should use an existing x-request-id request header for the response x-request-id header", async () => {
    // GIVEN
    const {ctx, response, request, call} = await createContextFixture({
      headers: {
        "x-request-id": "test-id"
      }
    });
    response.req = request;

    jest.spyOn(PlatformResponse.prototype, "setHeader");

    // WHEN
    await call();

    // THEN
    expect(ctx.response.setHeader).toBeCalledWith("x-request-id", "test-id");
  });
});
