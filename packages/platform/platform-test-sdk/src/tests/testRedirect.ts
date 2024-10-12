import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context} from "@tsed/platform-params";
import {Get, Location, Redirect} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

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

  @Get("/scenario-3")
  @Redirect(301, "/test")
  testScenario3(@Context() ctx: Context) {
    ctx.response.redirect(302, "/another/path");

    return "Hello";
  }

  @Get("/scenario-4")
  @Redirect("back")
  testScenario4(@Context() ctx: Context) {
    return "Hello";
  }

  @Get("/scenario-5")
  @Location("back")
  testScenario5(@Context() ctx: Context) {
    return "Hello";
  }

  @Get("/scenario-6")
  @(Location("/path/to").Status(301))
  testScenario6(@Context() ctx: Context) {
    return "Hello";
  }

  @Get("/scenario-7")
  @Location("/path/to")
  testScenario7(@Context() ctx: Context) {
    ctx.response.location("/another/path");
    return "Hello";
  }
}

export function testRedirect(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [RedirectCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario1: GET /rest/redirect/scenario-1", async () => {
    const response = await request.get("/rest/redirect/scenario-1").expect(302);

    expect(response.text).toEqual("Found. Redirecting to /test");
    expect(response.header.location).toEqual("/test");
  });

  it("Scenario1: HEAD /rest/redirect/scenario-1", async () => {
    const response = await request.head("/rest/redirect/scenario-1").expect(302);

    expect(response.text).toBeUndefined();
    expect(response.header.location).toEqual("/test");
  });

  it("Scenario2: GET /rest/redirect/scenario-2", async () => {
    const response = await request.get("/rest/redirect/scenario-2").expect(301);

    expect(response.text).toEqual("Moved Permanently. Redirecting to /test");
    expect(response.header.location).toEqual("/test");
  });

  it("Scenario3: GET /rest/redirect/scenario-3", async () => {
    const response = await request.get("/rest/redirect/scenario-3").expect(302);

    expect(response.header.location).toEqual("/another/path");
    expect(response.text).toEqual("Found. Redirecting to /another/path");
  });

  it("Scenario4: GET /rest/redirect/scenario-4 with referer", async () => {
    const response = await request.get("/rest/redirect/scenario-4").set("Referrer", "https://referrer.com").expect(302);

    expect(response.text).toEqual("Found. Redirecting to https://referrer.com");
    expect(response.header.location).toEqual("https://referrer.com");
  });

  it("Scenario5: GET /rest/redirect/scenario-5", async () => {
    const response = await request.get("/rest/redirect/scenario-5").set("Referrer", "https://referrer.com").expect(200);

    expect(response.text).toEqual("Hello");
    expect(response.header.location).toEqual("https://referrer.com");
  });

  it("Scenario6: GET /rest/redirect/scenario-6", async () => {
    const response = await request.get("/rest/redirect/scenario-6").set("Referrer", "https://referrer.com").expect(301);

    expect(response.text).toEqual("Hello");
    expect(response.header.location).toEqual("/path/to");
  });

  it("Scenario7: GET /rest/redirect/scenario-7", async () => {
    const response = await request.get("/rest/redirect/scenario-7").set("Referrer", "https://referrer.com").expect(200);

    expect(response.text).toEqual("Hello");
    expect(response.header.location).toEqual("/another/path");
  });
}
