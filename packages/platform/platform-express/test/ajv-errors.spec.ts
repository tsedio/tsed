import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {DefaultMsg, ErrorMsg, Integer, Post, Property, Required, TypeError} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

@DefaultMsg("this is a default message")
class MyModel {
  @(Required().Error("this is a required variable"))
  test: string;

  @Integer()
  foo: number;
}

@TypeError("this is a TypeError message")
class MyTypeErrorModel {
  @Property()
  @Integer()
  bar: string;
}

@ErrorMsg({type: "this is a Normal Error message"})
class MyErrorModel {
  @Property()
  @Integer()
  bar: string;
}

@Controller("/ajv-errors")
class TestAjvErrors {
  @Post("/required-error")
  scenario1(@BodyParams() model: MyModel) {
    return model;
  }

  @Post("/type-error")
  scenario2(@Required() @BodyParams(MyTypeErrorModel) model: MyTypeErrorModel) {
    return model;
  }

  @Post("/default-error")
  scenario3(@BodyParams(MyModel) model: MyModel) {
    return model;
  }

  @Post("/error-msg")
  scenario4(@BodyParams(MyErrorModel) model: MyErrorModel) {
    return model;
  }
}

describe("AJV Errors", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestAjvErrors]
      }
    })
  );
  afterAll(utils.reset);

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });

  describe("POST /rest/ajv-errors/required-error", () => {
    it("should return custom required error", async () => {
      const {body} = await request.post("/rest/ajv-errors/required-error").send({foo: "1"}).expect(400);

      expect(body).toEqual({
        errors: [
          {
            data: {
              foo: 1
            },
            requestPath: "body",
            dataPath: "",
            instancePath: "",
            keyword: "errorMessage",
            message: "this is a required variable",
            modelName: "MyModel",
            params: {
              errors: [
                {
                  emUsed: true,
                  instancePath: "",
                  keyword: "required",
                  message: "must have required property 'test'",
                  params: {
                    missingProperty: "test"
                  },
                  schemaPath: "#/required"
                }
              ]
            },
            schemaPath: "#/errorMessage"
          }
        ],
        message: 'Bad request on parameter "request.body".\nMyModel this is a required variable. Given value: {"foo":1}',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("POST /rest/ajv-errors/type-error", () => {
    it("should return type error message", async () => {
      const {body} = await request.post("/rest/ajv-errors/type-error").send([]).expect(400);

      expect(body).toEqual({
        errors: [
          {
            data: [],
            requestPath: "body",
            dataPath: "",
            instancePath: "",
            keyword: "errorMessage",
            message: "this is a TypeError message",
            modelName: "MyTypeErrorModel",
            params: {
              errors: [
                {
                  emUsed: true,
                  instancePath: "",
                  keyword: "type",
                  message: "must be object",
                  params: {
                    type: "object"
                  },
                  schemaPath: "#/type"
                }
              ]
            },
            schemaPath: "#/errorMessage"
          }
        ],
        message: 'Bad request on parameter "request.body".\nMyTypeErrorModel this is a TypeError message. Given value: []',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("POST /rest/ajv-errors/default-error", () => {
    it("should return default error message", async () => {
      const {body} = await request.post("/rest/ajv-errors/default-error").send({test: "hey", foo: "foo"}).expect(400);

      expect(body).toEqual({
        errors: [
          {
            data: {
              foo: "foo",
              test: "hey"
            },
            requestPath: "body",
            dataPath: "",
            instancePath: "",
            keyword: "errorMessage",
            message: "this is a default message",
            modelName: "MyModel",
            params: {
              errors: [
                {
                  emUsed: true,
                  instancePath: "/foo",
                  keyword: "type",
                  message: "must be integer",
                  params: {
                    type: "integer"
                  },
                  schemaPath: "#/properties/foo/type"
                }
              ]
            },
            schemaPath: "#/errorMessage"
          }
        ],
        message: 'Bad request on parameter "request.body".\nMyModel this is a default message. Given value: {"test":"hey","foo":"foo"}',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("POST /rest/ajv-errors/error-msg", () => {
    it("should return type error message using ErrorMsg decorator", async () => {
      const {body} = await request.post("/rest/ajv-errors/error-msg").send([]).expect(400);

      expect(body).toEqual({
        errors: [
          {
            data: [],
            requestPath: "body",
            dataPath: "",
            instancePath: "",
            keyword: "errorMessage",
            message: "this is a Normal Error message",
            modelName: "MyErrorModel",
            params: {
              errors: [
                {
                  emUsed: true,
                  instancePath: "",
                  keyword: "type",
                  message: "must be object",
                  params: {
                    type: "object"
                  },
                  schemaPath: "#/type"
                }
              ]
            },
            schemaPath: "#/errorMessage"
          }
        ],
        message: 'Bad request on parameter "request.body".\nMyErrorModel this is a Normal Error message. Given value: []',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
});
