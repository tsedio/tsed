import {Controller, Get, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";
import {FeatureModule} from "../modules/feature/FeatureModule";

@Controller("/root")
class TestRootCtrl {
  @Get("/")
  testScenario1() {
    return "From root";
  }
}

export function testModule(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestRootCtrl]
      },
      imports: [FeatureModule]
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: GET /rest/root", () => {
    it("should get content from root controller", async () => {
      const response = await request.get("/rest/root").expect(200);

      expect(response.text).to.deep.equal("From root");
    });
  });

  describe("Scenario2: GET /rest/features", () => {
    it("should get content from a module with his controller", async () => {
      const response = await request.get("/rest/features").expect(200);

      expect(response.text).to.deep.equal("From feature");
    });
  });
}
