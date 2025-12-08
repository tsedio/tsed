import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context, CookiesParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Controller("/cookies")
export class CookiesCtrl {
  /**
   * Handle request and get auth from cookies
   * @param authorization
   */
  @Get("/scenario-1")
  public scenario1(@CookiesParams("authorization") authorization: string) {
    return {authorization};
  }

  @Get("/scenario-2")
  public scenario2(@Context() $ctx: Context) {
    $ctx.response.cookie("test", "test", {
      path: "/",
      sameSite: true
    });

    $ctx.response.setHeader("test", "test");
    return "OK";
  }
}

export function testCookies(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [CookiesCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  it("Scenario 1: GET /rest/cookies/scenario-1", async () => {
    const {body} = await request.get("/rest/cookies/scenario-1").set("Cookie", "authorization=eOIjdkk").expect(200);

    expect(body.authorization).toEqual("eOIjdkk");
  });

  it("Scenario 2: GET /rest/cookies/scenario-2", async () => {
    const {headers} = await request.get("/rest/cookies/scenario-2").expect(200);

    expect(headers["set-cookie"][0]).toContain("test=test;");
  });
}
