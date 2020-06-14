import {Err, Get, HandlerContext, ParamMetadata, ParamTypes, PlatformTest, QueryParams} from "@tsed/common";
import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {PlatformExpressHandler} from "./PlatformExpressHandler";

function build(injector: InjectorService, type: string | ParamTypes | Type<any>, {expression, required}: any = {}) {
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

describe("PlatformExpressHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });
  describe("getParam()", () => {
    it(
      "should return BODY",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.BODY);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.request.body);
        }
      )
    );
    it(
      "should return PATH",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.PATH);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.request.params);
        }
      )
    );
    it(
      "should return QUERY",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.QUERY);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.request.query);
        }
      )
    );
    it(
      "should return HEADER",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.HEADER);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq({"content-type": "application/json"});
        }
      )
    );
    it(
      "should return COOKIES",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.COOKIES);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.request.cookies);
        }
      )
    );
    it(
      "should return SESSION",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.SESSION);

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.request.session);
        }
      )
    );
    it(
      "should return LOCALS",
      PlatformTest.inject(
        [InjectorService, PlatformExpressHandler],
        async (injector: InjectorService, platformHandler: PlatformExpressHandler) => {
          // GIVEN
          const {param, context} = build(injector, ParamTypes.LOCALS);
          context.err = new Error();

          // WHEN
          const value = platformHandler.getParam(param, context);

          // THEN
          expect(value).to.deep.eq(context.response.locals);
        }
      )
    );
  });
});
