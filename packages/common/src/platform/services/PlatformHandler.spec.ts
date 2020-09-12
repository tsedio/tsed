import {
  EndpointMetadata,
  Err,
  Get,
  HandlerContext,
  HandlerMetadata,
  HandlerType,
  ParamTypes,
  PlatformTest,
  QueryParams,
  useCtxHandler
} from "@tsed/common";
import {Provider} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest} from "../../../../../test/helper";
import {buildPlatformHandler} from "../../../../../test/helper/buildPlatformHandler";
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

class CustomPlatformHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    return metadata.handler;
  }

  protected onError(error: unknown, h: HandlerContext): any {}
}

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
        token: Test,
        target: Test,
        type: HandlerType.ENDPOINT,
        propertyKey: "get"
      });

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);

      // THEN
      expect(handler).to.eq(handlerMetadata.handler);
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
      sandbox.stub(Test.prototype, "get").callsFake((o) => o);
      sandbox.stub(PlatformTest.injector, "invoke").callsFake(() => new Test());

      const request = new FakeRequest();
      request.aborted = true;
      const response = new FakeRequest();

      const handlerMetadata = new HandlerMetadata({
        token: Test,
        target: Test,
        type: HandlerType.ENDPOINT,
        propertyKey: "get"
      });

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);
      const next = Sinon.stub();

      handler(request, response, next);

      // THEN
      return expect(next).to.not.have.been.called;
    });
  });
  describe("getArg()", () => {
    it("should return REQUEST", async () => {
      // GIVEN
      const {param, request, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.REQUEST
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.type, h);

      // THEN
      expect(value).to.deep.eq(request);
    });
    it("should return RESPONSE", async () => {
      // GIVEN
      const {param, response, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.RESPONSE
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(response);
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
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.BODY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().body);
    });

    it("should return PATH", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.PATH
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().params);
    });

    it("should return QUERY", async () => {
      // GIVEN
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.QUERY
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().query);
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
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.COOKIES
      });

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().cookies);
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
      const {param, h, platformHandler} = await buildPlatformHandler({
        token: CustomPlatformHandler,
        sandbox,
        type: ParamTypes.LOCALS
      });
      h.err = new Error();

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(h.getRequest().locals);
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
