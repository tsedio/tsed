import "@tsed/ajv";
import {Server, rootDir} from "./app/Server.js";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {Middleware} from "@tsed/platform-middlewares";
import {Next} from "@tsed/platform-http";
import {PlatformFastify} from "../src/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

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

@Middleware()
class GlobalInputMiddleware {
  use(@Next() next: any) {
    next();
  }
}

describe("GlobalMiddleware", () => {
  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestHealth]
      },
      middlewares: [GlobalInputMiddleware]
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
