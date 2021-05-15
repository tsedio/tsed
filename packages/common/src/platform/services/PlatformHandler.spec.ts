import {
  Context,
  EndpointMetadata,
  Err,
  Get,
  HandlerMetadata,
  HandlerType,
  Middleware,
  ParamTypes,
  PlatformTest,
  QueryParams
} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {buildPlatformHandler} from "../../../../../test/helper/buildPlatformHandler";
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

      PlatformTest.invoke(Test);

      const handlerMetadata = new HandlerMetadata({
        injector: PlatformTest.injector,
        token: Test,
        target: Test,
        type: HandlerType.ENDPOINT,
        propertyKey: "get"
      });

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

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
      sandbox.stub(PlatformTest.injector, "invoke").callsFake(() => new Test());

      const $ctx = createFakePlatformContext(sandbox);

      $ctx.request.raw.aborted = true;
      $ctx.endpoint = EndpointMetadata.get(Test, "get");

      const handlerMetadata = new HandlerMetadata({
        injector: PlatformTest.injector,
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

      const ctx = createFakePlatformContext(sandbox);
      const next = sandbox.stub();

      const handlerMetadata = new HandlerMetadata({
        injector: PlatformTest.injector,
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
  describe("getArg()", () => {
    it("should return REQUEST (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.NODE_REQUEST
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getReq());
    });
    it("should return REQUEST (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.REQUEST
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest());
    });
    it("should return REQUEST (platform)", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.PLATFORM_REQUEST
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.request);
    });
    it("should return RESPONSE (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.NODE_RESPONSE
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRes());
    });
    it("should return RESPONSE (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.RESPONSE
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getResponse());
    });
    it("should return RESPONSE (platform)", async () => {
      // GIVEN
      const {param, $ctx, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.PLATFORM_RESPONSE
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.response);
    });
    it("should return NEXT", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.NEXT_FN
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.next);
    });
    it("should return ERR", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.ERR
      });
      h.err = new Error();

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.err);
    });
    it("should return $CTX", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.$CTX
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx);
    });
    it("should return RESPONSE_DATA", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.RESPONSE_DATA
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx.data);
    });
    it("should return ENDPOINT_INFO", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.ENDPOINT_INFO
      });

      // @ts-ignore
      request.$ctx.endpoint = "endpoint";

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(request.$ctx.endpoint);
    });
    it("should return BODY", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.BODY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().body);
    });
    it("should return PATH", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.PATH
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().params);
    });
    it("should return QUERY", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.QUERY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().query);
    });
    it("should return HEADER", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.HEADER
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq({
        accept: "application/json",
        "content-type": "application/json"
      });
    });
    it("should return COOKIES", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.COOKIES
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().cookies);
    });
    it("should return SESSION", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.SESSION
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request.session);
    });
    it("should return LOCALS", async () => {
      // GIVEN
      const {param, h, $ctx, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.LOCALS
      });
      h.err = new Error();

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq($ctx.getResponse().locals);
    });
    it("should return request by default", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: "UNKNOWN"
      });
      param.expression = "test";

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.request);
    });
  });
});
