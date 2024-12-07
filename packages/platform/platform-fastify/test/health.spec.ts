import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformFastify} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify,
  server: Server
});

@Controller("/health")
class TestHealth {
  @Get("/1")
  scenario1() {
    return {
      fastify: "hello world"
    };
  }
}

describe("Health", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestHealth]
      }
    })
  );
  afterAll(() => utils.reset());

  describe("GET /rest/health", () => {
    it("should return hello world", async () => {
      const request = SuperTest(PlatformTest.callback());

      const {body} = await request.get("/rest/health/1").expect(200);

      expect(body).toEqual({
        fastify: "hello world"
      });
    });
  });
});
