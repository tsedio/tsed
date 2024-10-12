import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, QueryParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Email, Post, Required} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

class Model {
  @Required()
  phone: string;
}

@Controller("/query-params-validation")
class TestQueryParamsCtrl {
  @Post("/scenario-1")
  testScenario1(
    @QueryParams("email")
    @Required()
    @Email()
    email: string,
    @BodyParams(Model) @Required() body: Model
  ) {
    return {email, body};
  }

  @Post("/scenario-2")
  testScenario2(@BodyParams(Model) @Required() body: Model) {
    return {body};
  }
}

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

describe("QueryParamValidation", () => {
  let request: SuperTest.Agent;

  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestQueryParamsCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(() => utils.reset());

  describe("scenario 1", () => {
    it("should validate the email", async () => {
      const response = await request
        .post("/rest/query-params-validation/scenario-1?email=email@email.fr")
        .send({
          phone: "phone"
        })
        .expect(200);

      expect(response.body).toEqual({email: "email@email.fr", body: {phone: "phone"}});
    });

    it("should validate the email (REQUIRED)", async () => {
      const response = await request.post("/rest/query-params-validation/scenario-1").send({}).expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            requestPath: "query",
            keyword: "required",
            message: "It should have required parameter 'email'",
            modelName: "query",
            params: {
              missingProperty: "email"
            },
            schemaPath: "#/required",
            dataPath: ".email"
          }
        ],
        message: "Bad request on parameter \"request.query.email\".\nIt should have required parameter 'email'",
        name: "REQUIRED_VALIDATION_ERROR",
        status: 400
      });
    });

    it("should validate the email (FORMAT)", async () => {
      const response = await request.post("/rest/query-params-validation/scenario-1?email=wrong").send({}).expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            data: "wrong",
            requestPath: "query",
            dataPath: ".email",
            instancePath: "",
            keyword: "format",
            message: 'must match format "email"',
            params: {
              format: "email"
            },
            schemaPath: "#/format"
          }
        ],
        message: 'Bad request on parameter "request.query.email".\nValue must match format "email". Given value: "wrong"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
  describe("scenario 2", () => {
    it("should validate the email", async () => {
      const response = await request
        .post("/rest/query-params-validation/scenario-1?email=email@email.fr")
        .send({
          phone: "phone"
        })
        .expect(200);

      expect(response.body).toEqual({email: "email@email.fr", body: {phone: "phone"}});
    });

    it("should validate the email (REQUIRED)", async () => {
      const response = await request.post("/rest/query-params-validation/scenario-2").send({}).expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            dataPath: ".phone",
            instancePath: "",
            keyword: "required",
            message: "must have required property 'phone'",
            modelName: "Model",
            params: {
              missingProperty: "phone"
            },
            requestPath: "body",
            schemaPath: "#/required"
          }
        ],
        message: 'Bad request on parameter "request.body".\nModel must have required property \'phone\'. Given value: "undefined"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });

    it("should validate the email (FORMAT)", async () => {
      const response = await request.post("/rest/query-params-validation/scenario-2?email=wrong").send({}).expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            dataPath: ".phone",
            instancePath: "",
            keyword: "required",
            message: "must have required property 'phone'",
            modelName: "Model",
            params: {
              missingProperty: "phone"
            },
            requestPath: "body",
            schemaPath: "#/required"
          }
        ],
        message: 'Bad request on parameter "request.body".\nModel must have required property \'phone\'. Given value: "undefined"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
});
