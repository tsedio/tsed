import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get, Location} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Controller("/location")
class LocationCtrl {
  @Get("/scenario-1")
  @Location("/test")
  testScenario1() {
    return "Hello";
  }
}

export function testLocation(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [LocationCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario1: GET /rest/location/scenario-1", async () => {
    const response = await request.get("/rest/location/scenario-1").expect(200);

    expect(response.text).toEqual("Hello");
    expect(response.header.location).toEqual("/test");
  });
}
