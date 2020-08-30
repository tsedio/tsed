import {Controller, CookiesParams, Get, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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
}

export function testCookies(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [CookiesCtrl],
      },
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  it("Scenario 1: GET /rest/cookies/scenario-1", async () => {
    const {body} = await request.get("/rest/cookies/scenario-1").set("Cookie", "authorization=eOIjdkk=").expect(200);

    expect(body.authorization).to.eq("eOIjdkk=");
  });
}
