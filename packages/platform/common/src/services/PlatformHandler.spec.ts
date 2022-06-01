import {Context, EndpointMetadata, Err, Get, HandlerMetadata, HandlerType, Middleware, PlatformTest, QueryParams} from "@tsed/common";
import {PlatformHandler} from "./PlatformHandler";

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

class CustomPlatformHandler extends PlatformHandler {}

describe("PlatformHandler", () => {
  beforeEach(PlatformTest.create);
  beforeEach(() => {
    PlatformTest.injector.getProvider(PlatformHandler)!.useClass = CustomPlatformHandler;
  });
  afterEach(PlatformTest.reset);
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createHandler", () => {
    it("should return a native handler (success middleware)", async () => {
      // GIVEN
      jest.spyOn(Test.prototype, "get").mockImplementation((o) => o);

      const handlerMetadata = new HandlerMetadata({
        token: Test,
        target: Test,
        type: HandlerType.ENDPOINT,
        propertyKey: "get"
      });

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
      await PlatformTest.invoke(Test);

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);

      // THEN
      expect(handler).toBeInstanceOf(Function);
    });
    it("should return a native metadata (from native metadata)", async () => {
      // GIVEN
      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
      jest.spyOn(Test.prototype, "get").mockImplementation((o) => o);

      const nativeHandler = (req: any, res: any, next: any) => {};

      // WHEN
      const handler = platformHandler.createHandler(nativeHandler);

      // THEN
      expect(nativeHandler).toEqual(handler);
    });
    it("should do nothing when request is aborted", async () => {
      // GIVEN
      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

      const $ctx = PlatformTest.createRequestContext();

      $ctx.request.raw.aborted = true;
      $ctx.endpoint = EndpointMetadata.get(Test, "get");

      const handlerMetadata = new HandlerMetadata({
        token: Test,
        target: Test,
        type: HandlerType.ENDPOINT,
        propertyKey: "get"
      });

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);
      const next = jest.fn();

      await handler($ctx.getRequest(), $ctx.getResponse(), next);

      // THEN
      return expect(next).not.toBeCalled();
    });
    it("should call returned function", async () => {
      // GIVEN
      const internalMiddleware = jest.fn().mockReturnValue("hello");

      @Middleware()
      class Test {
        use(@Context() ctx: Context) {
          return internalMiddleware;
        }
      }

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
      await PlatformTest.invoke<Test>(Test);

      const ctx = PlatformTest.createRequestContext();
      const next = jest.fn();

      const handlerMetadata = new HandlerMetadata({
        token: Test,
        target: Test,
        type: HandlerType.MIDDLEWARE,
        propertyKey: "use"
      });

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);

      await handler(ctx.getRequest(), ctx.getResponse(), next);
      // THEN
      expect(internalMiddleware).toBeCalledWith(ctx.getRequest(), ctx.getResponse(), next);
    });
  });
});
