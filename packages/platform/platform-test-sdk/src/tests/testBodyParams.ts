import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, Context, HeaderParams, RawBodyParams} from "@tsed/platform-params";
import {
  Consumes,
  Default,
  Description,
  GenericOf,
  Generics,
  Maximum,
  Minimum,
  Nullable,
  Post,
  Property,
  Required,
  Status
} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

enum MyEnum {
  TITLE,
  AGE
}

class NestedModel {
  @Property()
  id: string;
}

class NullModel {
  @Property()
  prop1: string;

  @Property()
  prop2: number;

  @Property()
  prop3: Date;

  @Nullable(NestedModel)
  prop4: NestedModel;
}

class FindQuery {
  @Property()
  a?: string;

  @Property()
  b?: string;
}

@Generics("T")
class PaginationQuery<T> {
  // things about pagination
  @Minimum(0)
  @Default(0)
  offset?: number;

  @Minimum(1)
  @Maximum(1000)
  @Default(50)
  limit?: number;

  @Property("T")
  where?: T;
}

class Param1Type {
  @Required()
  value1!: string;
}

class Param2Type {
  @Required()
  value2!: string;
}

@Controller("/body-params")
class TestBodyParamsCtrl {
  @Post("/scenario-1")
  @Status(201)
  @Description("retrieve body and header content-type")
  testScenario1(@HeaderParams("Content-type") contentType: string, @BodyParams() payload: any) {
    return {payload, contentType};
  }

  @Post("/scenario-2")
  @Description("Extract field from body payload as string[]")
  testScenario2(@BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/scenario-3")
  @Description("Extract body payload as string[]")
  testScenario3(@BodyParams() value: string[]): any {
    return {value};
  }

  @Post("/scenario-4")
  @Description("Extract field from body payload as string[] with required annotation")
  testScenario4(@Required() @BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/scenario-4b")
  @Description("Extract field from body payload as string")
  testScenario4b(@Required() @BodyParams("test") value: string): any {
    return {value};
  }

  @Post("/scenario-4c")
  @Description("Extract field from body payload as number with required annotation")
  testScenario4c(@Required() @BodyParams("test") value: number): any {
    return {value};
  }

  @Post("/scenario-5")
  @Description("Extract raw body payload as Buffer")
  testScenario5(@RawBodyParams() raw: Buffer, @BodyParams() payload: any, @Context() context: Context): any {
    return {value: raw.toString("utf8")};
  }

  @Post("/scenario-6")
  testScenario6(@BodyParams("type", String) type: keyof typeof MyEnum): any {
    return {type};
  }

  @Post("/scenario-7")
  testScenario7(@BodyParams("test") value: string): any {
    return {value};
  }

  @Post("/scenario-8")
  testScenario8(@BodyParams() model: NullModel) {
    return {model};
  }

  @Post("/scenario-9")
  testScenario9(@BodyParams() @GenericOf(FindQuery) q: PaginationQuery<FindQuery>) {
    return {q};
  }

  @Post("/scenario-10")
  testScenario10(
    @Required() @BodyParams("param1", Param1Type) param1: Param1Type,
    @Required() @BodyParams("param2", Param2Type) param2: Param2Type
  ) {
    return {param1, param2};
  }

  @Post("/scenario-11")
  @Consumes("application/x-www-form-urlencoded")
  testScenario11(@Required() @BodyParams("client_id") client_id: string) {
    return {client_id};
  }
}

export function testBodyParams(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestBodyParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario 1: POST /rest/body-params/scenario-1", () => {
    it("should return a 201 response", async () => {
      const response = await request
        .post("/rest/body-params/scenario-1")
        .set({
          "Content-Type": "application/json"
        })
        .send({
          id: "id"
        })
        .expect(201);

      expect(response.body).toEqual({
        contentType: "application/json",
        payload: {
          id: "id"
        }
      });
    });
  });
  describe("Scenario2: with expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/body-params/scenario-2")
        .send({
          test: ["value"]
        })
        .expect(200);

      expect(response.body).toEqual({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/body-params/scenario-2").send().expect(200);

      expect(response.body).toEqual({});
    });
    it("should return an empty value (2)", async () => {
      const response = await request.post("/rest/body-params/scenario-2").send({}).expect(200);

      expect(response.body).toEqual({});
    });
  });
  describe("Scenario3: without expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-3").send(["value"]).expect(200);

      expect(response.body).toEqual({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/body-params/scenario-3").send({}).expect(200);

      expect(response.body).toEqual({value: [{}]});
    });
  });
  describe("Scenario4: with expression required Array<string>", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/body-params/scenario-4")
        .send({test: ["value"]})
        .expect(200);

      expect(response.body).toEqual({value: ["value"]});
    });
    it("should throw an exception", async () => {
      const response = await request.post("/rest/body-params/scenario-4").send().expect(400);

      expect(response.body).toEqual({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            requestPath: "body",
            dataPath: ".test",
            keyword: "required",
            message: "It should have required parameter 'test'",
            modelName: "body",
            params: {missingProperty: "test"},
            schemaPath: "#/required"
          }
        ]
      });
    });
  });
  describe("Scenario4b: with expression required String", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send({test: "value"}).expect(200);

      expect(response.body).toEqual({value: "value"});
    });
    it("should throw an exception when nothing is sent", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send().expect(400);

      expect(response.body).toEqual({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            requestPath: "body",
            dataPath: ".test",
            keyword: "required",
            message: "It should have required parameter 'test'",
            modelName: "body",
            params: {missingProperty: "test"},
            schemaPath: "#/required"
          }
        ]
      });
    });
    it("should throw an exception when nothing is an empty string is sent", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send({test: ""}).expect(400);

      expect(response.body).toEqual({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: ".test",
            requestPath: "body",
            keyword: "required",
            message: "It should have required parameter 'test'",
            modelName: "body",
            params: {missingProperty: "test"},
            schemaPath: "#/required"
          }
        ]
      });
    });
  });
  describe("Scenario4c: with expression required Number", () => {
    it("should return value (with 1)", async () => {
      const response = await request.post("/rest/body-params/scenario-4c").send({test: 1}).expect(200);

      expect(response.body).toEqual({value: 1});
    });
    it("should return value (with 0)", async () => {
      const response = await request.post("/rest/body-params/scenario-4c").send({test: 0}).expect(200);

      expect(response.body).toEqual({value: 0});
    });
    it("should throw an exception when nothing is sent", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send().expect(400);

      expect(response.body).toEqual({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: ".test",
            requestPath: "body",
            keyword: "required",
            message: "It should have required parameter 'test'",
            modelName: "body",
            params: {missingProperty: "test"},
            schemaPath: "#/required"
          }
        ]
      });
    });
  });
  describe("Scenario5: with raw payload", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-5").send('{"test": ["value"]}').expect(200);

      expect(response.body).toEqual({
        value: '{"test": ["value"]}'
      });
    });
  });
  describe("Scenario6: Enum", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-6").send({
        type: "TITLE"
      });

      expect(response.body).toEqual({
        type: "TITLE"
      });
    });
  });
  describe("Scenario7: payload with Null", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-7").send({
        test: null
      });

      expect(response.body).toEqual({
        value: null
      });
    });
  });
  describe("Scenario8: payload with props to null", () => {
    it("should return value with null value", async () => {
      const response = await request.post("/rest/body-params/scenario-8").send({
        prop1: null,
        prop2: null,
        prop3: null,
        prop4: null
      });

      expect(response.body).toEqual({
        model: {
          prop1: null,
          prop2: null,
          prop3: null,
          prop4: null
        }
      });
    });
  });
  describe("Scenario9: payload with Generics", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/body-params/scenario-9")
        .send({
          offset: 0,
          limit: 10,
          where: {
            a: "ca",
            b: "cb"
          }
        })
        .expect(200);

      expect(response.body).toEqual({
        q: {
          limit: 10,
          offset: 0,
          where: {
            a: "ca",
            b: "cb"
          }
        }
      });
    });
    it("should throw a bad request", async () => {
      const response = await request
        .post("/rest/body-params/scenario-9")
        .send({
          offset: 0,
          limit: 0,
          where: {
            a: "ca",
            b: "cb"
          }
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            data: 0,
            requestPath: "body",
            dataPath: ".limit",
            instancePath: "/limit",
            keyword: "minimum",
            message: "must be >= 1",
            modelName: "PaginationQuery",
            params: {
              comparison: ">=",
              limit: 1
            },
            schemaPath: "#/properties/limit/minimum"
          }
        ],
        message: 'Bad request on parameter "request.body".\nPaginationQuery.limit must be >= 1. Given value: 0',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
  describe("Scenario10: validate two payload", () => {
    it("should throw a Bad request if body params is missing (1)", async () => {
      await request
        .post("/rest/body-params/scenario-10")
        .send({param1: {}, param2: {value2: "value"}})
        .expect(400);
    });
    it("should throw a Bad request if body params is missing (2)", async () => {
      await request.post("/rest/body-params/scenario-10").send({param1: {}, param2: {}}).expect(400);
    });
    it("should throw a Bad request if body params is missing (3)", async () => {
      await request
        .post("/rest/body-params/scenario-10")
        .send({param1: {value: "value"}, param2: {}})
        .expect(400);
    });
    it("should throw a Bad request if body params is missing (4)", async () => {
      await request.post("/rest/body-params/scenario-10").send({}).expect(400);
    });
    it("should validate the body params", async () => {
      await request
        .post("/rest/body-params/scenario-10")
        .send({param1: {value1: "value"}, param2: {value2: "value"}})
        .expect(200);
    });
  });
  describe("Scenario11: validate application/x-www-form-urlencoded body", () => {
    it("should validate the body params", async () => {
      await request
        .post("/rest/body-params/scenario-11")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("client_id=id&grant_type=grant")
        .expect(200);
    });
  });
}
