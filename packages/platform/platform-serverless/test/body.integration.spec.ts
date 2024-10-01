import "@tsed/ajv";

import {Injectable} from "@tsed/di";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {MinLength, Patch, Post, Property, Put, Returns} from "@tsed/schema";

import {BodyParams, PlatformServerless} from "../src/index.js";

class Model {
  @Property()
  id: string;

  @MinLength(3)
  name: string;
}

@Injectable()
class BodyLambda {
  @Post("/scenario-1/:id")
  scenario1(@BodyParams("id") id: string) {
    return {
      id
    };
  }

  @(Put("/scenario-2/:id").Name("scenario2"))
  @(Returns(201, Model).Header("x-test", "test"))
  scenario2(@BodyParams() model: Model) {
    return model;
  }

  @Patch("/scenario-3/:id")
  scenario3(@BodyParams() model: Model) {
    return model;
  }
}

describe("Body params", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [BodyLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Post lambda with body", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.call("scenario1").post("/").body({
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
      const response = await PlatformServerlessTest.request.call("scenario2").put("/").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({
        id: "1",
        name: "Test"
      });
      expect(response.headers).toEqual({
        "x-test": "test",
        "x-request-id": "requestId",
        "content-type": "application/json"
      });
    });
    it("should throw an error", async () => {
      const response = await PlatformServerlessTest.request.call("scenario2").put("/").body({
        id: "1",
        name: "T"
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        errors: [
          {
            requestPath: "body",
            data: "T",
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
      const response = await PlatformServerlessTest.request.call("scenario3").patch("/").body({
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
