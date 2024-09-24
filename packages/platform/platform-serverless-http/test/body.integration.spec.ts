import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {BodyParams} from "@tsed/platform-params";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {MinLength, Patch, Post, Property, Put, Returns} from "@tsed/schema";

import {PlatformServerlessHttp} from "../src/index.js";
import {Server} from "./integration/aws-basic/src/Server.js";

class Model {
  @Property()
  id: string;

  @MinLength(3)
  name: string;
}

@Controller("/")
class BodyLambda {
  @Post("/scenario-1")
  scenario1(@BodyParams("id") id: string) {
    return {
      id
    };
  }

  @(Put("/scenario-2").Name("scenario2"))
  @(Returns(201, Model).Header("x-test", "test"))
  scenario2(@BodyParams() model: Model) {
    return model;
  }

  @Patch("/scenario-3")
  scenario3(@BodyParams() model: Model) {
    return model;
  }
}

describe("Body params", () => {
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

  describe("scenario1: Post lambda with body", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.post("/scenario-1").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        id: "1"
      });
    });
  });

  describe("scenario2: Put lambda with body and model mapping", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.put("/scenario-2").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({
        id: "1",
        name: "Test"
      });
      expect(response.headers).toEqual({
        "content-length": "24",
        "content-type": "application/json; charset=utf-8",
        etag: 'W/"18-jfUwSIdR5OF14k0Z7ilBjfRuwwE"',
        vary: "Accept-Encoding",
        "x-powered-by": "Express",
        "x-request-id": "requestId",
        "x-test": "test"
      });
    });
    it("should throw an error", async () => {
      const response = await PlatformServerlessTest.request.put("/scenario-2").body({
        id: "1",
        name: "T"
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        errors: [
          {
            data: "T",
            requestPath: "body",
            dataPath: ".name",
            instancePath: "/name",
            keyword: "minLength",
            message: "must NOT have fewer than 3 characters",
            modelName: "Model",
            params: {
              limit: 3
            },
            schemaPath: "#/properties/name/minLength"
          }
        ],
        message: 'Bad request on parameter "request.body".\nModel.name must NOT have fewer than 3 characters. Given value: "T"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("scenario3: Patch lambda with body and model mapping", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.patch("/scenario-3").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        id: "1",
        name: "Test"
      });
    });
  });
});
