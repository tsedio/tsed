import {expect, beforeAll, afterAll, describe, it} from "vitest";
import {Controller, Get, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";
import {FeatureModule} from "../modules/feature/FeatureModule.js";

@Controller("/root")
class TestRootCtrl {
  @Get("/")
  testScenario1() {
    return "From root";
  }
}

export function testModule(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestRootCtrl]
      },
      imports: [FeatureModule]
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario1: GET /rest/root", () => {
    it("should get content from root controller", async () => {
      const response = await request.get("/rest/root").expect(200);

      expect(response.text).toEqual("From root");
    });
  });

  describe("Scenario2: GET /rest/features", () => {
    it("should get content from a module with his controller", async () => {
      const response = await request.get("/rest/features").expect(200);

      expect(response.text).toEqual("From feature");
    });
  });
}
