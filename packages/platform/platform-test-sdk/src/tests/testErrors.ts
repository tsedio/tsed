import "@tsed/ajv";

import {Env} from "@tsed/core";
import {Controller} from "@tsed/di";
import {BadRequest, InternalServerError} from "@tsed/exceptions";
import {Err} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, UseAfter} from "@tsed/platform-middlewares";
import {BodyParams} from "@tsed/platform-params";
import {Description, Get, Name, Post, Required, Returns, Summary} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {CustomBadRequest} from "../errors/CustomBadRequest.js";
import {CustomInternalError} from "../errors/CustomInternalError.js";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";

class CustomModel {
  @Required() name: string;
}

class CustomPropModel {
  @Name("role_item")
  @Required()
  roleItem: string;
}

@Middleware()
class ErrorMiddleware {
  use(@Err() error: any) {
    return {
      message: "no error"
    };
  }
}

@Middleware()
class FakeMiddleware {
  use() {
    return {
      message: "should not be called by the platform when endpoint throw an error"
    };
  }
}

@Controller("/errors")
export class ErrorsCtrl {
  @Get("/scenario-1")
  @(Returns(500, InternalServerError).Description("Custom Bad Request"))
  public scenario1() {
    throw new CustomBadRequest("Custom Bad Request");
  }

  @Get("/scenario-2")
  @(Returns(500).Description("Internal Server Error"))
  public scenario2() {
    throw new Error("My error");
  }

  @Get("/scenario-3")
  @(Returns(400, CustomInternalError).Description("Bad request"))
  public scenario3() {
    throw new CustomInternalError("My custom error");
  }

  @Post("/scenario-4")
  @Returns(400)
  public scenario4(@Required() @BodyParams("name") name: string) {
    return name;
  }

  @Post("/scenario-5")
  @(Returns(400, BadRequest).Description("Bad request"))
  public scenario5(
    @Required()
    @BodyParams()
    model: CustomModel
  ) {
    return model;
  }

  @Post("/scenario-6")
  @Summary("Throw a Required prop if prop name is required")
  @Description(`Return a required error`)
  @(Returns(400).Description("Bad request"))
  public scenario6(
    @Required()
    @BodyParams()
    model: CustomPropModel
  ) {
    return model;
  }

  @Get("/scenario-7")
  @(Returns(400).Description("Bad request"))
  @UseAfter(FakeMiddleware)
  @UseAfter(ErrorMiddleware)
  public scenario7() {
    throw new CustomInternalError("My custom error");
  }
}

export function testErrors(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      env: Env.TEST,
      mount: {
        "/rest": [ErrorsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario 1: GET /rest/errors/scenario-1", async () => {
    const response: any = await request.get("/rest/errors/scenario-1").expect(400);

    expect(response.headers["x-header-error"]).toEqual("deny");
    expect(response.body).toEqual({
      name: "CUSTOM_BAD_REQUEST",
      message: "Custom Bad Request",
      status: 400,
      errors: ["test"]
    });
  });

  it("Scenario 2: GET /rest/errors/scenario-2", async () => {
    const response: any = await request.get("/rest/errors/scenario-2").expect(500);

    expect(response.body).toEqual({
      errors: [],
      message: "My error",
      name: "Error",
      status: 500
    });
  });

  it("Scenario 3: GET /rest/errors/scenario-3", async () => {
    const response: any = await request.get("/rest/errors/scenario-3").expect(500);

    expect(response.headers["x-header-error"]).toEqual("deny");
    expect(response.body).toEqual({
      name: "CUSTOM_INTERNAL_SERVER_ERROR",
      message: "My custom error",
      status: 500,
      errors: ["test"]
    });
  });

  it("Scenario 4: POST /rest/errors/scenario-4", async () => {
    const response: any = await request.post("/rest/errors/scenario-4").expect(400);

    expect(response.body).toEqual({
      errors: [
        {
          dataPath: ".name",
          requestPath: "body",
          keyword: "required",
          message: "It should have required parameter 'name'",
          modelName: "body",
          params: {
            missingProperty: "name"
          },
          schemaPath: "#/required"
        }
      ],
      message: "Bad request on parameter \"request.body.name\".\nIt should have required parameter 'name'",
      name: "REQUIRED_VALIDATION_ERROR",
      status: 400
    });
  });

  it("Scenario 5: POST /rest/errors/scenario-5", async () => {
    const response: any = await request.post("/rest/errors/scenario-5").send({}).expect(400);

    expect(response.body).toEqual({
      errors: [
        {
          dataPath: ".name",
          requestPath: "body",
          instancePath: "",
          keyword: "required",
          message: "must have required property 'name'",
          modelName: "CustomModel",
          params: {
            missingProperty: "name"
          },
          schemaPath: "#/required"
        }
      ],
      message: 'Bad request on parameter "request.body".\nCustomModel must have required property \'name\'. Given value: "undefined"',
      name: "AJV_VALIDATION_ERROR",
      status: 400
    });
  });

  it("Scenario 6: POST /rest/errors/scenario-6", async () => {
    const response: any = await request.post(`/rest/errors/scenario-6`).send({}).expect(400);

    expect(response.body).toEqual({
      errors: [
        {
          dataPath: ".role_item",
          requestPath: "body",
          instancePath: "",
          keyword: "required",
          message: "must have required property 'role_item'",
          modelName: "CustomPropModel",
          params: {
            missingProperty: "role_item"
          },
          schemaPath: "#/required"
        }
      ],
      message:
        'Bad request on parameter "request.body".\nCustomPropModel must have required property \'role_item\'. Given value: "undefined"',
      name: "AJV_VALIDATION_ERROR",
      status: 400
    });
  });

  it("Scenario 7: GET /rest/errors/scenario-7", async () => {
    const response: any = await request.get("/rest/errors/scenario-7").expect(200);

    expect(response.body).toEqual({
      message: "no error"
    });
  });
}
