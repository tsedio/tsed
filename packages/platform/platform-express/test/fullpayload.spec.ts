import {BodyParams, Controller, PlatformTest, Post} from "@tsed/common";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";
import {PlatformExpress} from "../src/index";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

@Controller("/full")
class TestFullPayloadCtrl {
  @Post("/scenario-1")
  testScenario9(@BodyParams() largePayload: any) {
    return largePayload;
  }
}

describe("Full payload", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestFullPayloadCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(utils.reset);
  describe("Scenario1: large payload", () => {
    it("should accept a large payload", async () => {
      const response = await request.post("/rest/full/scenario-1").send(require("./data/largePayload.json"));

      expect(response.status).toEqual(413);
      expect(response.body).toEqual({
        errors: [],
        message: "request entity too large",
        name: "PayloadTooLargeError",
        status: 413
      });
    });
  });
});
