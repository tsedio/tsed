import fs from "node:fs/promises";
import {join} from "node:path";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Post} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const root = import.meta.dirname;

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
  async testScenario1(@BodyParams() largePayload: any) {
    const payload = await fs.readFile(join(root, "data/largePayload.json"), {encoding: "utf8"});
    return JSON.parse(payload);
  }
}

describe("Full payload", () => {
  let request: SuperTest.Agent;

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

  afterEach(() => utils.reset());
  describe("Scenario1: large payload", () => {
    it("should accept a large payload", async () => {
      const payload = await fs.readFile(join(root, "data/largePayload.json"), {encoding: "utf8"});
      const response = await request.post("/rest/full/scenario-1").send(payload);

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
