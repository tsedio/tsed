import {Context, Controller, Get, HeaderParams, Locals, Middleware, PlatformTest, Post, Req, Use} from "@tsed/common";
import {Enum, Required} from "@tsed/schema";
import SuperTest from "supertest";
import {PlatformTestingSdkOpts} from "../interfaces";

@Middleware()
class SetId {
  use(@Req() request: any, @Locals() locals: any, @Context() $ctx: Context) {
    request["user"] = 1;
    locals.id = "local-10909";
    $ctx.set("uid", "ctx-10909");
  }
}

@Controller("/header-params")
export class HeaderParamsCtrl {
  /**
   * Handle request with a raw middleware + handler
   * Get Authorization from header
   * @param request
   * @param auth
   */
  @Get("/scenario-1")
  @Use(SetId)
  public scenario1(@Req() request: Req, @HeaderParams("authorization") auth: string): any {
    return {
      user: (request as any).user,
      token: auth
    };
  }

  @Post("/scenario-2")
  scenario2(@HeaderParams("Content-type") contentType: string) {
    return {contentType};
  }

  @Get("/scenario-3")
  testScenario3(
    @HeaderParams({
      expression: "x-token",
      useValidation: true
    })
    @Required()
    @Enum("test", "gcp")
    token: string
  ): any {
    return {token};
  }
}

export function testHeaderParams(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [HeaderParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario 1: GET /rest/header-params/scenario-1", () => {
    it("should return a response with the extracted authorization from the request headers", async () => {
      const {body}: any = await request
        .get("/rest/header-params/scenario-1")
        .set({
          Authorization: "tokenauth"
        })
        .expect(200);

      expect(body.user).toEqual(1);
      expect(body.token).toEqual("tokenauth");
    });
  });

  describe("Scenario 2: POST with contentType", () => {
    it("should return a response with the extracted contentType from the request headers", async () => {
      const response = await request
        .post("/rest/header-params/scenario-2")
        .send({})
        .set({
          "Content-Type": "application/json"
        })
        .expect(200);

      expect(response.body).toEqual({
        contentType: "application/json"
      });
    });
  });
  describe("Scenario3: GET /rest/headers/scenario-3", () => {
    it("should accept the header", async () => {
      const response = await request.get("/rest/header-params/scenario-3").set("x-token", "test").expect(200);

      expect(response.body).toEqual({
        token: "test"
      });
    });

    it("should not validate the header", async () => {
      const response = await request.get("/rest/header-params/scenario-3").expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            dataPath: "",
            keyword: "required",
            message: "It should have required parameter 'x-token'",
            modelName: "header",
            params: {
              missingProperty: "x-token"
            },
            schemaPath: "#/required"
          }
        ],
        message: "Bad request on parameter \"request.header.x-token\".\nIt should have required parameter 'x-token'",
        name: "REQUIRED_VALIDATION_ERROR",
        status: 400
      });
    });

    it("should not validate the header - enum", async () => {
      const response = await request.get("/rest/header-params/scenario-3").set("x-token", "invalid").expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            data: "invalid",
            dataPath: "",
            instancePath: "",
            keyword: "enum",
            message: "must be equal to one of the allowed values",
            params: {
              allowedValues: ["test", "gcp"]
            },
            schemaPath: "#/enum"
          }
        ],
        message:
          'Bad request on parameter "request.header.x-token".\nValue must be equal to one of the allowed values. Given value: "invalid"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
}
