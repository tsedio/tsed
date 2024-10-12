import {Injectable, ProviderScope} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {buildPlatformParams, invokePlatformParams} from "../../test/helpers/buildPlatformParams.js";
import {PathParams} from "../decorators/pathParams.js";
import {QueryParams} from "../decorators/queryParams.js";
import {ParamTypes} from "../domain/ParamTypes.js";

describe("PlatformParams", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("getArg()", () => {
    it("should return REQUEST (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.NODE_REQUEST,
        dataPath: "$ctx.request.req"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getReq());
    });
    it("should return REQUEST (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.REQUEST,
        dataPath: "$ctx.request.request"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRequest());
    });
    it("should return REQUEST (platform)", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.PLATFORM_REQUEST,
        dataPath: "$ctx.request"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.request);
    });
    it("should return RESPONSE (node)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.NODE_RESPONSE,
        dataPath: "$ctx.response.res"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRes());
    });
    it("should return RESPONSE (framework)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.RESPONSE,
        dataPath: "$ctx.response.response"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getResponse());
    });
    it("should return RESPONSE (platform)", async () => {
      // GIVEN
      const {param, $ctx, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.PLATFORM_RESPONSE,
        dataPath: "$ctx.response"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.response);
    });
    it("should return NEXT", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.NEXT_FN,
        dataPath: "next"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toBeInstanceOf(Function);
    });
    it("should return ERR", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.ERR,
        dataPath: "$ctx.error"
      });
      h.$ctx.error = new Error();

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual(h.$ctx.error);
    });
    it("should return $CTX", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.$CTX,
        dataPath: "$ctx"
      });

      // WHEN
      // @ts-ignore
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx);
    });
    it("should return RESPONSE_DATA", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.RESPONSE_DATA,
        dataPath: "$ctx.data"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.data);
    });
    it("should return ENDPOINT_INFO", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.ENDPOINT_INFO,
        dataPath: "$ctx.endpoint"
      });

      // @ts-ignore
      $ctx.endpoint = "endpoint";

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.endpoint);
    });
    it("should return BODY", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.BODY,
        dataPath: "$ctx.request.body"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRequest().body);
    });
    it("should return PATH", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.PATH,
        dataPath: "$ctx.request.params"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRequest().params);
    });
    it("should return QUERY", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.QUERY,
        dataPath: "$ctx.request.query"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRequest().query);
    });
    it("should return HEADER", async () => {
      // GIVEN
      const {param, h, platformParams, ctx} = await buildPlatformParams({
        paramType: ParamTypes.HEADER,
        dataPath: "$ctx.request.headers"
      });

      ctx.request.raw.headers["accept"] = "application/json";
      ctx.request.raw.headers["content-type"] = "application/json";

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual({
        accept: "application/json",
        "content-type": "application/json"
      });
    });
    it("should return COOKIES", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.COOKIES,
        dataPath: "$ctx.request.cookies"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getRequest().cookies);
    });
    it("should return SESSION", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.SESSION,
        dataPath: "$ctx.request.session"
      });

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.request.session);
    });
    it("should return LOCALS", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        paramType: ParamTypes.LOCALS,
        dataPath: "$ctx.response.locals"
      });

      h.$ctx.error = new Error();

      // WHEN
      const pipes = await platformParams.getPipes(param);
      const value = await platformParams.getArg(h, pipes, param);

      // THEN
      expect(value).toEqual($ctx.getResponse().locals);
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

      PlatformTest.injector.addProvider(MyCtrTest);

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const $ctx = PlatformTest.createRequestContext({
        event: {
          request: {
            query: {
              test: "test"
            },
            params: {
              s: "s"
            }
          }
        }
      });

      const result = await handler({
        $ctx
      });

      expect(result).toEqual({
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
        event: {
          request: {
            query: {
              test: "test"
            },
            params: {
              s: "s"
            }
          }
        }
      });

      PlatformTest.injector.addProvider(MyCtrTest);

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const result = await handler({
        $ctx
      });

      expect(result).toEqual({
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

      PlatformTest.injector.addProvider(MyCtrTest);

      const $ctx = PlatformTest.createRequestContext({
        event: {
          request: {
            query: {
              test: "test"
            },
            params: {
              s: "s"
            }
          }
        }
      });

      const handler = await platformParams.compileHandler({
        token: MyCtrTest,
        propertyKey: "get"
      });

      const result = await handler({
        $ctx
      });

      expect(result).toEqual("test");
    });
    it("should return handler", async () => {
      const platformParams = await invokePlatformParams();

      const $ctx = PlatformTest.createRequestContext({
        event: {
          request: {
            query: {
              test: "test"
            },
            params: {
              s: "s"
            }
          }
        }
      });

      const handler = await platformParams.compileHandler({
        handler: ($ctx: any) => $ctx.request.query.test
      });

      const result = await handler({
        $ctx
      });

      expect(result).toEqual("test");
    });
  });
});
