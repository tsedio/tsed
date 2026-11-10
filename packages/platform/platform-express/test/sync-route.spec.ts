import {Configuration, Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import {PlatformExpress} from "../src/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

const rootDir = import.meta.dirname;
const sentWhenNextReturned = new Map<string, boolean>();

// raw Express middleware mounted before the Ts.ED routes: records whether the response was sent
// by the time the downstream handlers returned
function recordSync(req: any, res: any, next: () => void) {
  next();
  sentWhenNextReturned.set(req.url, res.headersSent);
}

@Controller("/sync-route")
class SyncRouteCtrl {
  @Get("/hello")
  @Returns(200, String)
  hello() {
    return "hello world";
  }

  @Get("/async")
  @Returns(200, String)
  async asyncHello() {
    await new Promise((resolve) => setTimeout(resolve, 1));

    return "hello async";
  }
}

@Configuration({
  logger: {level: "off"},
  middlewares: [recordSync]
})
class SyncRouteServer {}

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: SyncRouteServer
});

describe("Synchronous route", () => {
  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [SyncRouteCtrl]
      }
    })
  );
  afterAll(() => utils.reset());

  it("should send the response of a sync route before the Ts.ED handlers return", async () => {
    const {text} = await SuperTest(PlatformTest.callback()).get("/rest/sync-route/hello").expect(200);

    expect(text).toEqual("hello world");
    expect(sentWhenNextReturned.get("/rest/sync-route/hello")).toEqual(true);
  });

  it("should send the response of an async route once the endpoint resolves", async () => {
    const {text} = await SuperTest(PlatformTest.callback()).get("/rest/sync-route/async").expect(200);

    expect(text).toEqual("hello async");
    expect(sentWhenNextReturned.get("/rest/sync-route/async")).toEqual(false);
  });
});
