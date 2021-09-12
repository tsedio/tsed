import {PlatformTest} from "@tsed/common";
import {ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import Sinon from "sinon";
import {buildPlatformParams} from "../../../../test/helper/buildPlatformParams";

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(h.next);
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
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(h.err);
    });
    it("should return $CTX", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.$CTX,
        dataPath: "$ctx"
      });

      // WHEN
      // @ts-ignore
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx);
    });
    it("should return RESPONSE_DATA", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.RESPONSE_DATA,
        dataPath: "$ctx.data"
      });

      // WHEN
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(h.request.$ctx.data);
    });
    it("should return ENDPOINT_INFO", async () => {
      // GIVEN
      const {param, request, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.ENDPOINT_INFO,
        dataPath: "$ctx.endpoint"
      });

      // @ts-ignore
      request.$ctx.endpoint = "endpoint";

      // WHEN
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(request.$ctx.endpoint);
    });
    it("should return BODY", async () => {
      // GIVEN
      const {param, h, $ctx, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.BODY,
        dataPath: "$ctx.request.body"
      });

      // WHEN
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

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
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq($ctx.getRequest().cookies);
    });
    it("should return SESSION", async () => {
      // GIVEN
      const {param, h, platformParams} = await buildPlatformParams({
        sandbox,
        paramType: ParamTypes.SESSION,
        dataPath: "$ctx.request.session"
      });

      // WHEN
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq(h.request.session);
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
      const [value] = await platformParams.getArgs(h, [param]);

      // THEN
      expect(value).to.deep.eq($ctx.getResponse().locals);
    });
  });
});
