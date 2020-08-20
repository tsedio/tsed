import "@tsed/ajv";
import {BodyParams, Controller, Description, Get, Name, PlatformTest, Post, Required, Returns} from "@tsed/common";
import {Summary} from "@tsed/swagger";
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

@Controller("/errors")
export class ErrorsCtrl {
  @Get("/scenario-1")
  @Returns(500, {description: "Custom Bad Request"})
  public scenario1() {
    throw new CustomBadRequest("Custom Bad Request");
  }

  @Get("/scenario-2")
  @Returns(500, {description: "Internal Server Error"})
  public scenario2() {
    throw new Error("My error");
  }

  @Get("/scenario-3")
  @Returns(400, {description: "Bad request"})
  public scenario3() {
    throw new CustomInternalError("My custom error");
  }

  @Post("/scenario-4")
  @Returns(400, {description: "Bad request"})
  public scenario4(@Required() @BodyParams("name") name: string) {
    return name;
  }

  @Post("/scenario-5")
  @Returns(400, {description: "Bad request"})
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
  @Returns(400, {description: "Bad request"})
  public scenario6(
    @Required()
    @BodyParams()
    model: CustomPropModel
  ) {
    return model;
  }
}

export function testErrors(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
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
    expect(response.text).to.deep.eq("Custom Bad Request");
    // expect(response.body).to.deep.eq({
    //   "name": "CUSTOM_BAD_REQUEST",
    //   "message": "Custom Bad Request",
    //   "status": 400,
    //   "errors": ["test"]
    // });
  });

  it("Scenario 2: GET /rest/errors/scenario-2", async () => {
    const response: any = await request.get("/rest/errors/scenario-2").expect(500);

    expect(response.text).to.deep.eq("Internal Error");
    // expect(response.body).to.deep.eq({
    //   "errors": [],
    //   "message": "My error",
    //   "name": "Error",
    //   "status": 500
    // });
  });

  it("Scenario 3: GET /rest/errors/scenario-3", async () => {
    const response: any = await request.get("/rest/errors/scenario-3").expect(500);

    expect(response.headers["x-header-error"]).to.eq("deny");
    expect(response.text).to.deep.eq("My custom error");
    // expect(response.body).to.deep.eq({
    //   "name": "CUSTOM_INTERNAL_SERVER_ERROR",
    //   "message": "My custom error",
    //   "status": 500,
    //   "errors": ["test"]
    // });
  });

  it("Scenario 4: POST /rest/errors/scenario-4", async () => {
    const response: any = await request.post("/rest/errors/scenario-4").expect(400);

    expect(response.text).to.deep.eq("Bad request on parameter \"request.body.name\".<br />It should have required parameter 'name'");
    // expect(response.body).to.deep.eq({
    //   "name": "REQUIRED_VALIDATION_ERROR",
    //   "message": "Bad request on parameter \"request.body.name\".\nIt should have required parameter 'name'",
    //   "status": 400,
    //   "errors": [{
    //     "dataPath": "",
    //     "keyword": "required",
    //     "message": "It should have required parameter 'name'",
    //     "modelName": "body",
    //     "params": {"missingProperty": "name"},
    //     "schemaPath": "#/required"
    //   }]
    // });
  });

  it("Scenario 5: POST /rest/errors/scenario-5", async () => {
    const response: any = await request.post("/rest/errors/scenario-5").expect(400);

    expect(response.text).to.deep.eq(
      "Bad request on parameter \"request.body\".<br />CustomModel should have required property 'name'. Given value: \"undefined\""
    );
    // expect(response.body).to.deep.eq({
    //   "name": "AJV_VALIDATION_ERROR",
    //   "message": "Bad request on parameter \"request.body\".\nCustomModel should have required property 'name'. Given value: \"undefined\"",
    //   "status": 400,
    //   "errors": [{
    //     "keyword": "required",
    //     "dataPath": "",
    //     "schemaPath": "#/required",
    //     "params": {"missingProperty": "name"},
    //     "message": "should have required property 'name'",
    //     "modelName": "CustomModel"
    //   }]
    // });
  });

  it("Scenario 6: POST /rest/errors/scenario-6", async () => {
    const response: any = await request
      .post(`/rest/errors/scenario-6`)
      .send({})
      .expect(400);

    expect(response.text).to.deep.eq(
      "Bad request on parameter \"request.body\".<br />CustomPropModel should have required property 'role_item'. Given value: \"undefined\""
    );
  });
}
