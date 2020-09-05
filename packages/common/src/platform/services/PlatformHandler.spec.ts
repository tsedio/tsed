import {
  EndpointMetadata,
  Err,
  Get,
  HandlerContext,
  HandlerMetadata,
  HandlerType,
  ParamMetadata,
  ParamTypes,
  PlatformRequest,
  PlatformResponse,
  PlatformTest,
  QueryParams
} from "@tsed/common";
import {Provider} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {PlatformHandler} from "./PlatformHandler";

async function build(type: string, {expression, required}: any = {}) {
  const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

  class Test {
    test() {
    }
  }

  const param = new ParamMetadata({target: Test, propertyKey: "test", index: 0});
  param.service = type;

  const request: any = new FakeRequest();
  const response: any = new FakeResponse();
  request.$ctx = PlatformTest.createRequestContext({
    response: new PlatformResponse(response),
    request: new PlatformRequest(request)
  });

  const next: any = Sinon.stub();
  const h = new HandlerContext({
    injector: PlatformTest.injector,
    request,
    response,
    next,
    args: [],
    metadata: {} as any
  });

  if (expression) {
    param.expression = expression;
  }
  if (required) {
    param.required = required;
  }

  return {
    platformHandler,
    h,
    param,
    request,
    response,
    next
  };
}

const sandbox = Sinon.createSandbox();

class Test {
  @Get("/")
  get(@QueryParams("test") v: string) {
    return v;
  }

  use(@Err() error: any) {
    return error;
  }

  useErr(err: any, req: any, res: any, next: any) {
  }
}

class CustomPlatformHandler extends PlatformHandler {
  protected createRawHandler(metadata: HandlerMetadata): Function {
    return metadata.handler;
  }

  protected onError(error: unknown, h: HandlerContext): any {

  }
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

  describe("createHandlerMetadata", () => {
    it(
      "should return metadata from Endpoint", async () => {

        // GIVEN

        const endpoint = new EndpointMetadata({
          target: Test,
          propertyKey: "get"
        });

        const platformHandler = await PlatformTest.invoke<CustomPlatformHandler>(PlatformHandler);
        sandbox.stub(PlatformTest.injector, "getProvider").returns(new Provider(Test));

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(endpoint);

        // THEN
        expect(handlerMetadata.target).to.eq(Test);
        expect(handlerMetadata.propertyKey).to.eq("get");
        expect(handlerMetadata.type).to.eq(HandlerType.CONTROLLER);
      });

    it(
      "should return metadata from Middleware", async () => {
        // GIVEN
        const platformHandler = await PlatformTest.invoke<CustomPlatformHandler>(PlatformHandler);
        sandbox.stub(PlatformTest.injector, "getProvider").returns(new Provider(Test));

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(Test);

        // THEN
        expect(handlerMetadata.target).to.eq(Test);
        expect(handlerMetadata.propertyKey).to.eq("use");
        expect(handlerMetadata.type).to.eq(HandlerType.MIDDLEWARE);
      });

    it(
      "should return metadata from Function", async () => {
        const platformHandler = await PlatformTest.invoke<CustomPlatformHandler>(PlatformHandler);

        // GIVEN
        sandbox.stub(PlatformTest.injector, "getProvider").returns(undefined);

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(() => {
        });

        // THEN
        expect(handlerMetadata.type).to.eq(HandlerType.FUNCTION);
      });
  });
  describe("createHandler", () => {
    it("should return a native metadata (success middleware)", async () => {
      // GIVEN
      sandbox.stub(Test.prototype, "get").callsFake((o) => o);

      PlatformTest.invoke(Test);

      const request: any = new FakeRequest();
      const response: any = new FakeRequest();
      request.$ctx = PlatformTest.createRequestContext({
        response: new PlatformResponse(response),
        request: new PlatformRequest(request)
      });

      const handlerMetadata = new HandlerMetadata({
        token: Test,
        target: Test,
        type: HandlerType.CONTROLLER,
        propertyKey: "get"
      });

      const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);

      // WHEN
      const handler = platformHandler.createHandler(handlerMetadata);

      // THEN
      expect(handler).to.eq(handlerMetadata.handler);
    });
    it(
      "should return a native metadata (from native metadata)", async () => {
        // GIVEN
        const platformHandler = await PlatformTest.invoke<PlatformHandler>(PlatformHandler);
        sandbox.stub(Test.prototype, "get").callsFake((o) => o);

        const nativeHandler = (req: any, res: any, next: any) => {
        };

        // WHEN
        const handler = platformHandler.createHandler(nativeHandler);

        // THEN
        expect(nativeHandler).to.eq(handler);
      });


    it(
      "should do nothing when request is aborted", async () => {
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
          type: HandlerType.CONTROLLER,
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
      const {param, request, h, platformHandler} = await build(ParamTypes.REQUEST);

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.type, h);

      // THEN
      expect(value).to.deep.eq(request);
    });
    it("should return RESPONSE", async () => {
      // GIVEN
      const {param, response, h, platformHandler} = await build(ParamTypes.RESPONSE);

      // WHEN
      // @ts-ignore
      const value = platformHandler.getArg(param.paramType, h);

      // THEN
      expect(value).to.deep.eq(response);
    });
    it(
      "should return NEXT", async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.NEXT_FN);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.next);
      });
    it(
      "should return ERR",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.ERR);
        h.err = new Error();

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.err);
      });

    it(
      "should return $CTX",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.$CTX);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.$ctx);
      });

    it(
      "should return RESPONSE_DATA",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.RESPONSE_DATA);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.$ctx.data);
      });

    it(
      "should return ENDPOINT_INFO",
      async () => {
        // GIVEN
        const {param, request, h, platformHandler} = await build(ParamTypes.ENDPOINT_INFO);

        request.$ctx.endpoint = "endpoint";
        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(request.$ctx.endpoint);
      });

    it(
      "should return BODY",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.BODY);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.body);
      });

    it(
      "should return PATH",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.PATH);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.params);
      });

    it(
      "should return QUERY",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.QUERY);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.query);
      });

    it(
      "should return HEADER",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.HEADER);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq({
          accept: "application/json",
          "content-type": "application/json"
        });
      });

    it(
      "should return COOKIES",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.COOKIES);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.cookies);
      });

    it(
      "should return SESSION",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.SESSION);

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request.session);
      });

    it(
      "should return LOCALS",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build(ParamTypes.LOCALS);
        h.err = new Error();

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.response.locals);
      });

    it(
      "should return request by default",
      async () => {
        // GIVEN
        const {param, h, platformHandler} = await build("UNKNOWN");
        param.expression = "test";

        // WHEN
        // @ts-ignore
        const value = platformHandler.getArg(param.paramType, h);

        // THEN
        expect(value).to.deep.eq(h.request);
      });
  });
});
