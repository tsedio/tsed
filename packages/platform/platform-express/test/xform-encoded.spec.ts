import {BodyParams, Controller, PlatformTest} from "@tsed/common";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Consumes, Post, Required} from "@tsed/schema";
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

@Controller("/xform-encoded")
class TestResponseParamsCtrl {
  @Post("/")
  @Consumes("application/x-www-form-urlencoded")
  testScenario11(
    @Required() @BodyParams("param1") param1: string
  ) {
    return { param1 };
  }
}

describe("XForm encoded", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestResponseParamsCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(utils.reset);

  it("should return consume a x-www-form-urlencoded payload", async () => {
    const response = await request.post("/rest/xform-encoded")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("client_id=id&grant_type=grant");

    expect(response.body).toEqual({});
  });
});
