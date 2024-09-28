import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {Get, Returns} from "@tsed/schema";

import {PlatformServerlessHttp, ServerlessContext, ServerlessEvent} from "../src/index.js";
import {Server} from "./integration/aws-basic/src/Server.js";

@Controller("/")
class BodyLambda {
  @Get("/scenario-1")
  @Returns(200, Object)
  scenario1(@ServerlessEvent() event: any, @ServerlessContext() context: ServerlessContext) {
    return {event, context};
  }
}

describe("ServerlessEvent & ServerlessContext", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerlessHttp, {
      server: Server,
      adapter: PlatformExpress,
      mount: {
        "/": [BodyLambda]
      }
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1", () => {
    it("should return data", async () => {
      const response = await PlatformServerlessTest.request.get("/scenario-1");

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        context: {
          awsRequestId: "awsRequestId",
          callbackWaitsForEmptyEventLoop: false,
          functionName: "",
          functionVersion: "",
          invokedFunctionArn: "",
          logGroupName: "",
          logStreamName: "",
          memoryLimitInMB: ""
        },
        event: {
          body: "",
          headers: {},
          httpMethod: "GET",
          isBase64Encoded: false,
          multiValueHeaders: {},
          multiValueQueryStringParameters: {},
          path: "/scenario-1",
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
        }
      });
    });
  });
});
