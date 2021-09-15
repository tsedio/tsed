import {PlatformRequest, PlatformTest, ProviderScope} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {ParamTypes, PathParams, QueryParams} from "@tsed/platform-params";
import {expect} from "chai";
import Sinon from "sinon";
import {buildPlatformParams, invokePlatformParams} from "../../../../../test/helper/buildPlatformParams";

const sandbox = Sinon.createSandbox();

describe("PlatformParams", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("getArg()", () => {
    it("should return REQUEST (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.NODE_REQUEST,
        dataPath: "$ctx.request.req"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getReq());
    });
    it("should return REQUEST (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request.request"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest());
    });
    it("should return REQUEST (platform)", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.PLATFORM_REQUEST,
        dataPath: "$ctx.request"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.request);
    });
    it("should return RESPONSE (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.NODE_RESPONSE,
        dataPath: "$ctx.response.res"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRes());
    });
    it("should return RESPONSE (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.RESPONSE,
        dataPath: "$ctx.response.response"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getResponse());
    });
    it("should return RESPONSE (platform)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.PLATFORM_RESPONSE,
        dataPath: "$ctx.response"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.response);
    });
    it("should return NEXT", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.NEXT_FN,
        dataPath: "next"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.be.a("function");
    });
    it("should return ERR", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.ERR,
        dataPath: "err"
      });
      h.err = new Error();

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq(h.err);
    });
    it("should return $CTX", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.$CTX,
        dataPath: "$ctx"
      });

      // WHEN
      // @ts-ignore
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx);
    });
    it("should return RESPONSE_DATA", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.RESPONSE_DATA,
        dataPath: "$ctx.data"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.data);
    });
    it("should return ENDPOINT_INFO", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.ENDPOINT_INFO,
        dataPath: "$ctx.endpoint"
      });

      // @ts-ignore
      $ctx.endpoint = "endpoint";

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.endpoint);
    });
    it("should return BODY", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.BODY,
        dataPath: "$ctx.request.body"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().body);
    });
    it("should return PATH", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().params);
    });
    it("should return QUERY", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().query);
    });
    it("should return HEADER", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.HEADER,
        dataPath: "$ctx.request.headers"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq({
        accept: "application/json",
        "content-type": "application/json"
      });
    });
    it("should return COOKIES", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.COOKIES,
        dataPath: "$ctx.request.cookies"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().cookies);
    });
    it("should return SESSION", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.SESSION,
        dataPath: "$ctx.request.session"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.request.session);
    });
    it("should return LOCALS", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.LOCALS,
        dataPath: "$ctx.response.locals"
      });
      h.err = new Error();

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).to.deep.eq($ctx.getResponse().locals);
    });
  });
  describe("compileHandler()", () => {
    it("should build all params and return value (SINGLETON)", async () => {
      const platformParams = await invokePlatformParams();

      @Injectable()
      class MyCtrTest {
        get(@PathParams() params: any, @QueryParams() query: any) {
          return {params, query};
        }
      }

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const $ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest({
          query: {
            test: "test"
          },
          params: {
            s: "s"
          }
        } as any)
      });

      const result = await handler({
        $ctx
      });

      expect(result).to.deep.eq({
        query: {
          test: "test"
        },
        params: {
          s: "s"
        }
      });
    });
    it("should build all params and return value (REQUEST)", async () => {
      const platformParams = await invokePlatformParams();

      @Injectable({
        scope: ProviderScope.REQUEST
      })
      class MyCtrTest {
        get(@PathParams() params: any, @QueryParams() query: any) {
          return {params, query};
        }
      }

      const $ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest({
          query: {
            test: "test"
          },
          params: {
            s: "s"
          }
        } as any)
      });

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const result = await handler({
        $ctx
      });

      expect(result).to.deep.eq({
        query: {
          test: "test"
        },
        params: {
          s: "s"
        }
      });
    });
    it("should call without args", async () => {
      const platformParams = await invokePlatformParams();

      @Injectable()
      class MyCtrTest {
        get() {
          return "test";
        }
      }

      const $ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest({
          query: {
            test: "test"
          },
          params: {
            s: "s"
          }
        } as any)
      });

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const result = await handler({
        $ctx
      });

      expect(result).to.deep.eq("test");
    });
    it("should with default args", async () => {
      const platformParams = await invokePlatformParams();

      @Injectable()
      class MyCtrTest {
        get(query: any, params: any) {
          return {query, params};
        }
      }

      const $ctx = PlatformTest.createRequestContext({
        request: new PlatformRequest({
          query: {
            test: "test"
          },
          params: {
            s: "s"
          }
        } as any)
      });

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get",
        async getCustomArgs(scope: any) {
          return [scope.$ctx.request.query, scope.$ctx.request.params];
        }
      });

      const result = await handler({
        $ctx
      });

      expect(result).to.deep.eq({
        params: {
          s: "s"
        },
        query: {
          test: "test"
        }
      });
    });
  });
});
