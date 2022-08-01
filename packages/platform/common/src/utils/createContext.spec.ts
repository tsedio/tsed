import {PlatformResponse, PlatformTest} from "@tsed/common";
import {createContext} from "./createContext";

describe("createContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  it("should create context and attach it to the request", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request = PlatformTest.createRequest();
    const response = PlatformTest.createResponse();

    injector.settings.logger.level = "info";
    injector.settings.logger.ignoreUrlPatterns = ["/admin", /\/admin2/];

    jest.spyOn(injector, "emit").mockResolvedValue(undefined);
    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);

    // WHEN
    const invoke = createContext(injector);
    const ctx = await invoke({request, response});

    ctx.logger.info({event: "test"});
    ctx.logger.flush();

    // THEN
    expect(injector.logger.info).toHaveBeenCalled();
  });

  it("should add a x-request-id header to the response", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request = PlatformTest.createRequest();
    const response = PlatformTest.createResponse();
    response.req = request;

    // WHEN
    const invoke = createContext(injector);
    const ctx = await invoke({request, response});

    // THEN
    expect(ctx.response.raw.headers["x-request-id"]).toBeDefined();
  });

  it("should use an existing x-request-id request header for the response x-request-id header", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request = PlatformTest.createRequest({
      headers: {
        "x-request-id": "test-id"
      }
    });

    const response = PlatformTest.createResponse();
    response.req = request;

    jest.spyOn(PlatformResponse.prototype, "setHeader");

    // WHEN
    const invoke = createContext(injector);
    const ctx = await invoke({request, response});

    // THEN
    expect(ctx.response.raw.headers["x-request-id"]).toEqual("test-id");
  });
});
