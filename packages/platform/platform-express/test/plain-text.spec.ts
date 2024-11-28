import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get, Returns} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

@Controller("/plain-text")
class TestResponseParamsCtrl {
  @Get("/scenario-1")
  @(Returns(200, String).ContentType("text/plain"))
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
  let request: SuperTest.Agent;

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

  afterEach(() => utils.reset());
  describe("scenario 1", () => {
    it("should return a plain text", async () => {
      const response = await request.get("/rest/plain-text/scenario-1");

      expect(response.headers["content-type"]).toEqual("text/plain; charset=utf-8");
      expect(response.text).toEqual('{"id":"id"}');
    });
  });
  describe("scenario 2", () => {
    it("should return a */* content-type", async () => {
      const response = await request
        .get("/rest/plain-text/scenario-2")
        .set("Accept", "*/*")
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.body).toEqual({
        jsonexample: 1
      });
    });
  });
});
