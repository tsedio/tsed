import {EndpointMetadata, Err, Get, HandlerType, PlatformTest, QueryParams, useCtxHandler} from "@tsed/common";
import {Provider} from "@tsed/di";
import {createHandlerMetadata} from "./createHandlerMetadata";

class Test {
  @Get("/")
  get(@QueryParams("test") v: string) {
    return v;
  }

  use(@Err() error: any) {
    return error;
  }

  useErr(err: any, req: any, res: any, next: any) {}
}

describe("createHandlerMetadata", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return metadata from Endpoint", async () => {
    // GIVEN

    const endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "get"
    } as any);

    jest.spyOn(PlatformTest.injector, "getProvider").mockReturnValue(new Provider(Test));

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, endpoint);

    // THEN
    expect(handlerMetadata.target).toEqual(Test);
    expect(handlerMetadata.propertyKey).toEqual("get");
    expect(handlerMetadata.type).toEqual(HandlerType.ENDPOINT);
  });
  it("should return metadata from Middleware", async () => {
    // GIVEN
    jest.spyOn(PlatformTest.injector, "getProvider").mockReturnValue(new Provider(Test));

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, Test);

    // THEN
    expect(handlerMetadata.target).toEqual(Test);
    expect(handlerMetadata.propertyKey).toEqual("use");
    expect(handlerMetadata.type).toEqual(HandlerType.ERR_MIDDLEWARE);
  });
  it("should return metadata from Function", async () => {
    // GIVEN
    jest.spyOn(PlatformTest.injector, "getProvider").mockReturnValue(undefined);

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, () => {});

    // THEN
    expect(handlerMetadata.type).toEqual(HandlerType.RAW_FN);
  });
  it("should return metadata from useCtxHandler", async () => {
    // GIVEN
    jest.spyOn(PlatformTest.injector, "getProvider").mockReturnValue(undefined);

    // WHEN
    const handlerMetadata = createHandlerMetadata(
      PlatformTest.injector,
      useCtxHandler(() => {})
    );

    // THEN
    expect(handlerMetadata.type).toEqual(HandlerType.CTX_FN);
  });
});
