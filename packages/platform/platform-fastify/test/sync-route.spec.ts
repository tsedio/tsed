import diagnostics from "node:diagnostics_channel";
import {Configuration, Controller} from "@tsed/di";
import {Get, Returns} from "@tsed/schema";
import {PlatformFastify} from "../src/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

const rootDir = import.meta.dirname;

// global onSend hook (skip-override) that defers the send of one route only
function delayOnSend(fastify: any, _: unknown, done: () => void) {
  fastify.addHook("onSend", (request: any, _reply: unknown, payload: unknown, next: (err: null, payload: unknown) => void) => {
    if (request.url.endsWith("/delayed")) {
      setTimeout(() => next(null, payload), 5);
      return;
    }

    next(null, payload);
  });
  done();
}

(delayOnSend as any)[Symbol.for("skip-override")] = true;

@Controller("/sync-route")
class SyncRouteCtrl {
  @Get("/hello")
  @Returns(200, String)
  hello() {
    return "hello world";
  }

  @Get("/delayed")
  @Returns(200, String)
  delayed() {
    return "delayed";
  }
}

@Configuration({
  logger: {level: "off"},
  plugins: [delayOnSend as any]
})
class SyncRouteServer {}

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify,
  server: SyncRouteServer
});

describe("Synchronous route", () => {
  const asyncStarts: string[] = [];
  const channel = diagnostics.tracingChannel("fastify.request.handler");
  const subscribers = {
    start() {},
    end() {},
    asyncStart(message: any) {
      asyncStarts.push(message.request.url);
    },
    asyncEnd() {},
    error() {}
  };

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [SyncRouteCtrl]
      }
    })
  );
  beforeAll(() => channel.subscribe(subscribers));
  afterAll(() => channel.unsubscribe(subscribers));
  afterAll(() => utils.reset());
  beforeEach(() => {
    asyncStarts.length = 0;
  });

  it("should send the reply of a sync route without going through the Fastify promise path", async () => {
    const request = SuperTest(PlatformTest.callback());

    const {text} = await request.get("/rest/sync-route/hello").expect(200);

    expect(text).toEqual("hello world");
    expect(asyncStarts).toEqual([]);
  });

  it("should wait for a reply still in flight at the end of a sync route", async () => {
    const request = SuperTest(PlatformTest.callback());

    const {text} = await request.get("/rest/sync-route/delayed").expect(200);

    expect(text).toEqual("delayed");
    expect(asyncStarts).toEqual(["/rest/sync-route/delayed"]);
  });
});
