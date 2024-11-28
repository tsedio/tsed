import {Configuration, Controller, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {QueryParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get} from "@tsed/schema";
import {parse} from "querystring";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir} from "./app/Server.js";

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
    return {qs};
  }
}

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: CustomServer,
  logger: {
    level: "error"
  }
});

describe("QueryParser", () => {
  let request: SuperTest.Agent;

  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestQueryParamsCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(() => utils.reset());
  describe("Scenario1: DeepObject should not be parsed", () => {
    const endpoint = "/rest/query-params/scenario-1";
    it("should return the query value", async () => {
      const response = await request.get(`${endpoint}?q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1`).expect(200);

      expect(response.body).toEqual({
        qs: {
          "q[limit]": "10",
          "q[offset]": "0",
          "q[where][a]": "0",
          "q[where][b]": "1"
        }
      });
    });
  });
});
