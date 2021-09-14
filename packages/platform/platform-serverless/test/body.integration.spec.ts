import "@tsed/ajv";
import {Injectable} from "@tsed/di";
import {BodyParams, Patch, PlatformServerlessTest, Post, Put} from "@tsed/platform-serverless";
import {MinLength, Property, Returns} from "@tsed/schema";
import {expect} from "chai";

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

  @Put("/scenario-2/:id").Name("scenario2")
  @Returns(201, Model).Header("x-test", "test").Header("multi", ["test", "1"] as any)
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
    PlatformServerlessTest.bootstrap({
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

      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal({
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

      expect(response.statusCode).to.equal(201);
      expect(JSON.parse(response.body)).to.deep.equal({
        "id": "1",
        "name": "Test"
      });
      expect(response.headers).to.deep.equal({"x-test": "test"});
      expect(response.multiValueHeaders).to.deep.equal({});
    });
    it("should throw an error", async () => {
      const response = await PlatformServerlessTest.request.call("scenario2").put("/").body({
        id: "1",
        name: "T"
      });

      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response.body)).to.deep.equal({
        "errors": [
          {
            "data": "T",
            "dataPath": ".name",
            "instancePath": "/name",
            "keyword": "minLength",
            "message": "must NOT have fewer than 3 characters",
            "modelName": "Model",
            "params": {
              "limit": 3
            },
            "schemaPath": "#/properties/name/minLength"
          }
        ],
        "message": "Bad request on parameter \"request.body\".\nModel.name must NOT have fewer than 3 characters. Given value: \"T\"",
        "name": "AJV_VALIDATION_ERROR",
        "status": 400
      });
    });
  });

  describe("scenario3: Patch lambda with body and model mapping", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.call("scenario3").patch("/").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal({
        "id": "1",
        "name": "Test"
      });
    });
  });
});
