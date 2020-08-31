import {Controller, Get, HeaderParams, Next, PlatformTest, Post, Req, Res, Use} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

function rawMiddleware(request: Req, response: Res, next: Next) {
  request["user"] = 1;
  response.locals.id = "local-10909";
  request.ctx.set("uid", "ctx-10909");

  next();
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
  @Use(rawMiddleware)
  public scenario1(@Req() request: Req, @HeaderParams("authorization") auth: string): any {
    return {
      user: request.user,
      token: auth
    };
  }

  @Post("/scenario-2")
  scenario2(@HeaderParams("Content-type") contentType: string) {
    return {contentType};
  }
}

export function testHeaderParams(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [HeaderParamsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario 1: GET /rest/header-params/scenario-1", async () => {
    it("should return a response with the extracted authorization from the request headers", async () => {
      const {body}: any = await request
        .get("/rest/header-params/scenario-1")
        .set({
          Authorization: "tokenauth"
        })
        .expect(200);

      expect(body.user).to.equal(1);
      expect(body.token).to.equal("tokenauth");
    });
  });

  describe("Scenario 2: POST with contentType", () => {
    it("should return a response with the extracted contentType from the request headers", async () => {
      const response = await request
        .post("/rest/header-params/scenario-2")
        .set({
          "Content-Type": "application/json"
        })
        .expect(200);

      expect(response.body).to.deep.equal({
        contentType: "application/json"
      });
    });
  });
}
