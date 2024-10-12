import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {HeaderParams} from "@tsed/platform-params";
import {AcceptMime, ContentType, Get, Post} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Controller("/accept-mime")
class TestAcceptMimeCtrl {
  @Post("/scenario-1")
  @AcceptMime("application/json")
  scenario1(@HeaderParams("Accept") accept: string) {
    return {
      accept
    };
  }

  @Get("/scenario-2")
  @ContentType("text")
  @AcceptMime("text")
  public ping() {
    return "pong";
  }
}

export function testAcceptMime(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestAcceptMimeCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  describe("Scenario 1: POST /rest/accept-mime/scenario-1", () => {
    it('should return a 200 response when Accept header match with @AcceptMime("application/json")', async () => {
      const response = await request
        .post("/rest/accept-mime/scenario-1")
        .set({
          Accept: "application/json"
        })
        .expect(200);

      expect(response.body).toEqual({
        accept: "application/json"
      });
    });
    it('should return a 406 response when Accept header doesn\'t match with @AcceptMime("application/json")', async () => {
      const response = await request
        .post("/rest/accept-mime/scenario-1")
        .set({
          Accept: "application/xml"
        })
        .expect(406);

      expect(response.body).toEqual({
        name: "NOT_ACCEPTABLE",
        message: "You must accept content-type application/json",
        status: 406,
        errors: []
      });
    });
  });
  describe("Scenario 2: GET /rest/accept-mime/scenario-2", () => {
    it('should return a 200 response when Accept header match with @AcceptMime("text")', async () => {
      const response = await request
        .get("/rest/accept-mime/scenario-2")
        .set({
          Accept: "text/*, application/json"
        })
        .expect(200);

      expect(response.text).toEqual("pong");
    });
    it('should return a 406 response when Accept header doesn\'t match with @AcceptMime("text")', async () => {
      const response = await request
        .get("/rest/accept-mime/scenario-2")
        .set({
          Accept: "application/xml"
        })
        .expect(406);

      expect(response.body).toEqual({
        name: "NOT_ACCEPTABLE",
        message: "You must accept content-type text",
        status: 406,
        errors: []
      });
    });
  });
}
