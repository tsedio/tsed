import {rootDir} from "./app/Server";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {PlatformExpress} from "../src";
import SuperTest from "supertest";
import {Configuration, Controller, Get, Inject, PlatformApplication, PlatformTest, QueryParams} from "@tsed/common";
import {expect} from "chai";
import {parse} from "querystring";

@Configuration({
  port: 8081
})
class CustomServer {
  @Inject()
  app: PlatformApplication;

  $onInit() {
    this.app.getApp().set("query parser", (queryString: string) => {
      return parse(queryString);
    });
  }
}

@Controller("/query-params")
class TestQueryParamsCtrl {
  @Get("/scenario-1")
  testScenario1(@QueryParams() qs: any) {
    return { qs };
  }
}

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: CustomServer,
  logger: {
    level: "off"
  }
});

describe("QueryParser", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(utils.bootstrap({
    mount: {
      "/rest": [TestQueryParamsCtrl]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(utils.reset);
  describe("Scenario1: DeepObject should not be parsed", () => {
    const endpoint = "/rest/query-params/scenario-1";
    it("should return the query value", async () => {
      const response = await request.get(`${endpoint}?q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1`).expect(200);

      expect(response.body).to.deep.equal({
        "qs": {
          "q[limit]": "10",
          "q[offset]": "0",
          "q[where][a]": "0",
          "q[where][b]": "1"
        }
      });
    });
  });
});
