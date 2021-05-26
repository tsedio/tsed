import "@tsed/ajv";
import {BodyParams, Controller, HeaderParams, PlatformTest, Post, RawBodyParams} from "@tsed/common";
import {Nullable, Property, Required, Status} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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

@Controller("/body-params")
class TestBodyParamsCtrl {
  @Post("/scenario-1")
  @Status(201)
  scenario1(@HeaderParams("Content-type") contentType: string, @BodyParams() payload: any) {
    return {payload, contentType};
  }

  @Post("/scenario-2")
  testScenario1(@BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/scenario-3")
  testScenario2(@BodyParams() value: string[]): any {
    return {value};
  }

  @Post("/scenario-4")
  testScenario4(@Required() @BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/scenario-4b")
  testScenario4b(@Required() @BodyParams("test") value: string): any {
    return {value};
  }

  @Post("/scenario-4c")
  testScenario4c(@Required() @BodyParams("test") value: number): any {
    return {value};
  }

  @Post("/scenario-5")
  testScenario5(@RawBodyParams() payload: any): any {
    return {value: payload.toString("utf8")};
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
}

export function testBodyParams(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestBodyParamsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

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

      expect(response.body).to.deep.equal({
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

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/body-params/scenario-2").send().expect(200);

      expect(response.body).to.deep.equal({});
    });
    it("should return an empty value (2)", async () => {
      const response = await request.post("/rest/body-params/scenario-2").send({}).expect(200);

      expect(response.body).to.deep.equal({});
    });
  });
  describe("Scenario3: without expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-3").send(["value"]).expect(200);

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/body-params/scenario-3").send().expect(200);

      expect(response.body).to.deep.equal({value: [{}]});
    });
  });
  describe("Scenario4: with expression required Array<string>", () => {
    it("should return value", async () => {
      const response = await request
        .post("/rest/body-params/scenario-4")
        .send({test: ["value"]})
        .expect(200);

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should throw an exception", async () => {
      const response = await request.post("/rest/body-params/scenario-4").send().expect(400);

      expect(response.body).to.deep.equal({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: "",
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

      expect(response.body).to.deep.equal({value: "value"});
    });
    it("should throw an exception when nothing is sent", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send().expect(400);

      expect(response.body).to.deep.equal({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: "",
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

      expect(response.body).to.deep.equal({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: "",
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

      expect(response.body).to.deep.equal({value: 1});
    });
    it("should return value (with 0)", async () => {
      const response = await request.post("/rest/body-params/scenario-4c").send({test: 0}).expect(200);

      expect(response.body).to.deep.equal({value: 0});
    });
    it("should throw an exception when nothing is sent", async () => {
      const response = await request.post("/rest/body-params/scenario-4b").send().expect(400);

      expect(response.body).to.deep.equal({
        name: "REQUIRED_VALIDATION_ERROR",
        message: "Bad request on parameter \"request.body.test\".\nIt should have required parameter 'test'",
        status: 400,
        errors: [
          {
            dataPath: "",
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

      expect(response.body).to.deep.equal({
        value: '{"test": ["value"]}'
      });
    });
  });

  describe("Scenario6: Enum", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-6").send({
        type: "TITLE"
      });

      expect(response.body).to.deep.equal({
        type: "TITLE"
      });
    });
  });

  describe("Scenario7: payload with Null", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/body-params/scenario-7").send({
        test: null
      });

      expect(response.body).to.deep.equal({
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

      expect(response.body).to.deep.equal({
        model: {
          prop1: null,
          prop2: null,
          prop3: null,
          prop4: null
        }
      });
    });
  });
}
