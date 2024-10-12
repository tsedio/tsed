import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get, Returns} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/components/PlatformExpress.js";
import {rootDir, Server} from "./app/Server.js";

@Controller("/middlewares")
class TestMiddleware {
  @Get("/scenario-1")
  @(Returns(200).OneOf(Event))
  scenario1() {
    return (req: any, res: any, next: any) => {
      res.send("Hello");
    };
  }
}

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("Middleware", () => {
  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestMiddleware]
      },
      responseFilters: [TestMiddleware]
    })
  );
  afterEach(() => utils.reset());
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should chain middleware", async () => {
    const response = await SuperTest(PlatformTest.callback()).get("/rest/middlewares/scenario-1").expect(200);

    expect(response.text).toEqual("Hello");
  });
});
