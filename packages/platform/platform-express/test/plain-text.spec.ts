import {Controller, Get, PlatformTest} from "@tsed/common";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {getSpec, Returns, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformExpress} from "../src";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

@Controller("/plain-text")
class TestResponseParamsCtrl {
  @Get("/scenario-1")
  @Returns(200, String).ContentType("text/plain")
  test() {
    return {
      id: "id"
    };
  }

  @Get("/scenario-2")
  public scenario8() {
    return {
      jsonexample: 1
    };
  }
}

describe("PlainText", () => {
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
  describe("scenario 1", () => {
    it("should return a plain text", async () => {
      const response = await request.get("/rest/plain-text/scenario-1");

      expect(response.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(response.text).to.equal('{"id":"id"}');
    });
  });
  describe("scenario 2", () => {
    it("should return a */* content-type", async () => {
      const response = await request
        .get("/rest/plain-text/scenario-2")
        .set("Accept", "*/*")
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.headers["content-type"]).to.equal("application/json; charset=utf-8");
      expect(response.body).to.deep.equal({
        jsonexample: 1
      });
    });
  });
});
