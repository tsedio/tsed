import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {createServerlessContext} from "../../test/utils/createServerlessContext.js";

describe("ServerlessContext", () => {
  beforeEach(() => PlatformServerlessTest.create());
  afterEach(() => PlatformServerlessTest.reset());

  describe("constructor", () => {
    it("should push callback", () => {
      const ctx = createServerlessContext({
        endpoint: {} as any
      });
      expect(ctx.event).toEqual({
        body: "",
        headers: {},
        httpMethod: "",
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: "/",
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
          accountId: "",
          apiId: "",
          httpMethod: "",
          identity: {},
          path: "/",
          protocol: "https",
          requestId: "requestId",
          requestTimeEpoch: 0,
          resourceId: 1,
          resourcePath: "/",
          stage: ""
        },
        resource: "",
        stageVariables: {}
      });
      expect(ctx.response.raw).toEqual(ctx.request.raw);
      expect(ctx.request.event).toEqual(ctx.response.event);
      expect(ctx.request.response).toEqual(ctx.response);
      expect(ctx.response.request).toEqual(ctx.request);
    });
    it("should push callback with event headers", () => {
      const ctx = createServerlessContext({
        endpoint: {} as any,
        event: {
          headers: undefined
        }
      });
      expect(ctx.event).toEqual({
        body: "",
        headers: {},
        httpMethod: "",
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: "/",
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
          accountId: "",
          apiId: "",
          httpMethod: "",
          identity: {},
          path: "/",
          protocol: "https",
          requestId: "requestId",
          requestTimeEpoch: 0,
          resourceId: 1,
          resourcePath: "/",
          stage: ""
        },
        resource: "",
        stageVariables: {}
      });
      expect(ctx.response.raw).toEqual(ctx.request.raw);
      expect(ctx.request.event).toEqual(ctx.response.event);
      expect(ctx.request.response).toEqual(ctx.response);
      expect(ctx.response.request).toEqual(ctx.request);
    });
  });
});
