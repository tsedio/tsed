import {Controller, Get, PlatformTest, Redirect} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

@Controller("/redirect")
class RedirectCtrl {
  @Get("/scenario-1")
  @Redirect("/test")
  testScenario1() {
    return "Hello";
  }

  @Get("/scenario-2")
  @Redirect(301, "/test")
  testScenario2() {
    return "Hello";
  }
}

export function testRedirect(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [RedirectCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("Scenario1: GET /rest/redirect/scenario-1", async () => {
    const response = await request.get("/rest/redirect/scenario-1").expect(302);

    expect(response.text).to.deep.equal("Found. Redirecting to /test");
    expect(response.header.location).to.deep.equal("/test");
  });

  it("Scenario2: GET /rest/redirect/scenario-2", async () => {
    const response = await request.get("/rest/redirect/scenario-2").expect(301);

    expect(response.text).to.deep.equal("Moved Permanently. Redirecting to /test");
    expect(response.header.location).to.deep.equal("/test");
  });

  it("Scenario3: HEAD /rest/redirect/scenario-1", async () => {
    const response = await request.head("/rest/redirect/scenario-1").expect(302);

    expect(response.text).to.deep.equal(undefined);
    expect(response.header.location).to.deep.equal("/test");
  });
}
