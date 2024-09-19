import "@tsed/ajv";
import {Configuration, Controller, Get, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import SuperTest from "supertest";

const rootDir = import.meta.dirname;

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
  platform: PlatformExpress,
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
