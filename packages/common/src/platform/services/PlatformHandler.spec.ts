import {
  EndpointMetadata,
  Err,
  Get,
  HandlerContext,
  HandlerMetadata,
  HandlerType,
  ParamMetadata,
  ParamTypes,
  PlatformTest,
  QueryParams
} from "@tsed/common";
import {InjectorService, Provider} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {PlatformHandler} from "./PlatformHandler";

function build(injector: InjectorService, type: string, {expression, required}: any = {}) {
  class Test {
    test() {}
  }

  const param = new ParamMetadata({target: Test, propertyKey: "test", index: 0});
  param.service = type;

  const request: any = new FakeRequest();
  const response: any = new FakeResponse();
  const next: any = Sinon.stub();
  const context = new HandlerContext({
    injector,
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
    context,
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

  useErr(err: any, req: any, res: any, next: any) {}
}

describe("PlatformHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  describe("createHandlerMetadata", () => {
    it(
      "should return metadata from Endpoint",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(injector, "getProvider").returns(new Provider(Test));
        const endpoint = new EndpointMetadata({
          target: Test,
          propertyKey: "get"
        });

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(endpoint);

        // THEN
        expect(handlerMetadata.target).to.eq(Test);
        expect(handlerMetadata.propertyKey).to.eq("get");
        expect(handlerMetadata.type).to.eq(HandlerType.CONTROLLER);
      })
    );

    it(
      "should return metadata from Middleware",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(injector, "getProvider").returns(new Provider(Test));

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(Test);

        // THEN
        expect(handlerMetadata.target).to.eq(Test);
        expect(handlerMetadata.propertyKey).to.eq("use");
        expect(handlerMetadata.type).to.eq(HandlerType.MIDDLEWARE);
      })
    );

    it(
      "should return metadata from Function",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(injector, "getProvider").returns(undefined);

        // WHEN
        const handlerMetadata = platformHandler.createHandlerMetadata(() => {});

        // THEN
        expect(handlerMetadata.type).to.eq(HandlerType.FUNCTION);
      })
    );
  });
  describe("createHandler", () => {
    it(
      "should return a native metadata (success middleware)",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(Test.prototype, "get").callsFake(o => o);
        injector.invoke(Test);

        const request = new FakeRequest();
        const response = new FakeRequest();

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.CONTROLLER,
          propertyKey: "get"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        const result = await new Promise(resolve => {
          handler(request, response, resolve);
        });

        // THEN
        expect(result).to.eq(undefined);
        expect(handler.length).to.eq(3);
      })
    );
    it(
      "should return a native metadata (from native metadata)",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(Test.prototype, "get").callsFake(o => o);
        sandbox.stub(injector, "invoke").callsFake(() => new Test());

        const request = new FakeRequest();
        const response = new FakeRequest();
        const nativeHandler = (req: any, res: any, next: any) => {
          next();
        };

        // WHEN
        const handler = platformHandler.createHandler(nativeHandler);

        // THEN
        expect(nativeHandler).to.eq(handler);
      })
    );
    it(
      "should return a native metadata (error middleware)",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(Test.prototype, "use").callsFake(o => o);
        sandbox.stub(injector, "invoke").callsFake(() => new Test());

        const request = new FakeRequest();
        const response = new FakeRequest();
        const error = new Error("message");

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.CONTROLLER,
          propertyKey: "use"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        const result = await new Promise(resolve => {
          handler(error, request, response, resolve);
        });

        // THEN
        expect(result).to.eq(undefined);
        expect(handler.length).to.eq(4);
        expect(Test.prototype.use).to.have.been.calledWithExactly(error);
        expect(request.ctx.data).to.deep.eq(error);
      })
    );

    it(
      "should do nothing when request is aborted",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        sandbox.stub(Test.prototype, "get").callsFake(o => o);
        sandbox.stub(injector, "invoke").callsFake(() => new Test());

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
      })
    );
  });
  describe("getParam()", () => {
    it(
      "should return REQUEST",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, request, context} = build(injector, ParamTypes.REQUEST);

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(request);
      })
    );
    it(
      "should return RESPONSE",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, response, context} = build(injector, ParamTypes.RESPONSE);

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(response);
      })
    );
    it(
      "should return NEXT",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, next, context} = build(injector, ParamTypes.NEXT_FN);

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(context.next);
      })
    );
    it(
      "should return ERR",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, context} = build(injector, ParamTypes.ERR);
        context.err = new Error();

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(context.err);
      })
    );
    it(
      "should return CONTEXT",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, context} = build(injector, ParamTypes.CONTEXT);

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(context.request.ctx);
      })
    );
    it(
      "should return RESPONSE_DATA",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, context} = build(injector, ParamTypes.RESPONSE_DATA);

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(context.request.ctx.data);
      })
    );
    it(
      "should return ENDPOINT_INFO",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, request, context} = build(injector, ParamTypes.ENDPOINT_INFO);

        request.ctx.endpoint = "endpoint";
        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(request.ctx.endpoint);
      })
    );
    it(
      "should return request by default",
      PlatformTest.inject([InjectorService, PlatformHandler], async (injector: InjectorService, platformHandler: PlatformHandler) => {
        // GIVEN
        const {param, context} = build(injector, "UNKNOWN");
        param.expression = "test";

        // WHEN
        const value = platformHandler.getParam(param, context);

        // THEN
        expect(value).to.deep.eq(context.request);
      })
    );
  });
});
