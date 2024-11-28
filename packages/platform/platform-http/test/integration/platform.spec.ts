import "@tsed/ajv";

import {Configuration, Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get} from "@tsed/schema";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import SuperTest from "supertest";

import {PlatformTest} from "../../src/testing/index.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

@Controller("/hello")
class TestHelloWorld {
  @Get("/")
  test() {
    return {hello: "world"};
  }
}

@Configuration({
  port: 8081,
  logger: {
    level: "info"
  },
  middlewares: [cookieParser(), compress({}), methodOverride(), bodyParser.json()],
  mount: {
    "/rest": [TestHelloWorld]
  }
})
export class Server {}

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("QueryParser", () => {
  let request: SuperTest.Agent;

  beforeEach(utils.bootstrap());
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(utils.reset);
  describe("scenario test", () => {
    it("should return hello", async () => {
      const response = await request.get(`/rest/hello`).expect(200);

      expect(response.body).toEqual({
        hello: "world"
      });
    });
  });
});
