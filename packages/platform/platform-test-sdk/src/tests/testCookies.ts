import {Controller, CookiesParams, Get, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
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
}
