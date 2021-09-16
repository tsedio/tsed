import {Context, EndpointMetadata, Err, Get, HandlerMetadata, HandlerType, Middleware, PlatformTest, QueryParams} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {createFakePlatformContext} from "../../../../../test/helper/createFakePlatformContext";
import {PlatformHandler} from "./PlatformHandler";

const sandbox = Sinon.createSandbox();

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
    sandbox.restore();
  });

  describe("createHandler", () => {
    it("should return a native handler (success middleware)", async () => {
      // GIVEN
      sandbox.stub(Test.prototype, "get").callsFake((o) => o);

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
      expect(handler).to.be.a("function");
    });
    it("should return a native metadata (from native metadata)", async () => {
      // GIVEN
      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
      sandbox.stub(Test.prototype, "get").callsFake((o) => o);

      const nativeHandler = (req: any, res: any, next: any) => {};

      // WHEN
      const handler = platformHandler.createHandler(nativeHandler);

      // THEN
      expect(nativeHandler).to.eq(handler);
    });
    it("should do nothing when request is aborted", async () => {
      // GIVEN
      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

      const $ctx = createFakePlatformContext(sandbox);

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
      const next = Sinon.stub();

      await handler($ctx.getRequest(), $ctx.getResponse(), next);

      // THEN
      return expect(next).to.not.have.been.called;
    });
    it("should call returned function", async () => {
      // GIVEN
      const internalMiddleware = sandbox.stub().returns("hello");

      @Middleware()
      class Test {
        use(@Context() ctx: Context) {
          return internalMiddleware;
        }
      }

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
      await PlatformTest.invoke<Test>(Test);

      const ctx = createFakePlatformContext(sandbox);
      const next = sandbox.stub();

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
      expect(internalMiddleware).to.have.been.calledWithExactly(ctx.getRequest(), ctx.getResponse(), next);
    });
  });
});
