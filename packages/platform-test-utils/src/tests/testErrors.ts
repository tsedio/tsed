import "@tsed/ajv";
import {BodyParams, Controller, Err, Get, Middleware, PlatformTest, Post, UseAfter} from "@tsed/common";
import {Env} from "@tsed/core";
import {Description, Name, Required, Returns, Summary} from "@tsed/schema";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {CustomBadRequest} from "../errors/CustomBadRequest";
import {CustomInternalError} from "../errors/CustomInternalError";
import {PlatformTestOptions} from "../interfaces";

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
  @(Returns(500).Description("Custom Bad Request"))
  public scenario1() {
    throw new CustomBadRequest("Custom Bad Request");
  }

  @Get("/scenario-2")
  @(Returns(500).Description("Internal Server Error"))
  public scenario2() {
    throw new Error("My error");
  }

  @Get("/scenario-3")
  @(Returns(400).Description("Bad request"))
  public scenario3() {
    throw new CustomInternalError("My custom error");
  }

  @Post("/scenario-4")
  @(Returns(400).Description("Bad request"))
  public scenario4(@Required() @BodyParams("name") name: string) {
    return name;
  }

  @Post("/scenario-5")
  @(Returns(400).Description("Bad request"))
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

export function testErrors(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      env: Env.TEST,
      mount: {
        "/rest": [ErrorsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("Scenario 1: GET /rest/errors/scenario-1", async () => {
    const response: any = await request.get("/rest/errors/scenario-1").expect(400);

    expect(response.headers["x-header-error"]).to.eq("deny");
    expect(response.body).to.deep.eq({
      name: "CUSTOM_BAD_REQUEST",
      message: "Custom Bad Request",
      status: 400,
      errors: ["test"]
    });
  });

  it("Scenario 2: GET /rest/errors/scenario-2", async () => {
    const response: any = await request.get("/rest/errors/scenario-2").expect(500);

    expect(response.body).to.deep.eq({
      errors: [],
      message: "My error",
      name: "Error",
      status: 500
    });
  });

  it("Scenario 3: GET /rest/errors/scenario-3", async () => {
    const response: any = await request.get("/rest/errors/scenario-3").expect(500);

    expect(response.headers["x-header-error"]).to.eq("deny");
    expect(response.body).to.deep.eq({
      name: "CUSTOM_INTERNAL_SERVER_ERROR",
      message: "My custom error",
      status: 500,
      errors: ["test"]
    });
  });

  it("Scenario 4: POST /rest/errors/scenario-4", async () => {
    const response: any = await request.post("/rest/errors/scenario-4").expect(400);

    expect(response.body).to.deep.eq({
      name: "REQUIRED_VALIDATION_ERROR",
      message: "Bad request on parameter \"request.body.name\".\nIt should have required parameter 'name'",
      status: 400,
      errors: [
        {
          dataPath: "",
          keyword: "required",
          message: "It should have required parameter 'name'",
          modelName: "body",
          params: {missingProperty: "name"},
          schemaPath: "#/required"
        }
      ]
    });
  });

  it("Scenario 5: POST /rest/errors/scenario-5", async () => {
    const response: any = await request.post("/rest/errors/scenario-5").expect(400);

    expect(response.body).to.deep.eq({
      name: "AJV_VALIDATION_ERROR",
      message: "Bad request on parameter \"request.body\".\nCustomModel should have required property 'name'. Given value: \"undefined\"",
      status: 400,
      errors: [
        {
          keyword: "required",
          dataPath: "",
          schemaPath: "#/required",
          params: {missingProperty: "name"},
          message: "should have required property 'name'",
          modelName: "CustomModel"
        }
      ]
    });
  });

  it("Scenario 6: POST /rest/errors/scenario-6", async () => {
    const response: any = await request.post(`/rest/errors/scenario-6`).send({}).expect(400);

    expect(response.body).to.deep.eq({
      name: "AJV_VALIDATION_ERROR",
      message:
        "Bad request on parameter \"request.body\".\nCustomPropModel should have required property 'role_item'. Given value: \"undefined\"",
      status: 400,
      errors: [
        {
          keyword: "required",
          dataPath: "",
          schemaPath: "#/required",
          params: {missingProperty: "role_item"},
          message: "should have required property 'role_item'",
          modelName: "CustomPropModel"
        }
      ]
    });
  });

  it("Scenario 7: GET /rest/errors/scenario-7", async () => {
    const response: any = await request.get("/rest/errors/scenario-7").expect(200);

    expect(response.body).to.deep.eq({
      message: "no error"
    });
  });
}
