import "@tsed/ajv";
import {Server, rootDir} from "./app/Server.js";
import {Controller} from "@tsed/di";
import {$off, $on} from "@tsed/hooks";
import {Context} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {PlatformFastify} from "../src/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify,
  server: Server
});

@Controller("/context")
class TestRequestContext {
  @Get("/id")
  getId(@Context() $ctx: any) {
    return {id: $ctx.id, fromHook: $ctx.get("fromHook") || null};
  }
}

describe("Request context", () => {
  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestRequestContext]
      }
    })
  );
  afterAll(() => utils.reset());

  it("should reuse the incoming x-request-id header", async () => {
    const request = SuperTest(PlatformTest.callback());

    const {body, headers} = await request.get("/rest/context/id").set("x-request-id", "incoming-id").expect(200);

    expect(body.id).toEqual("incoming-id");
    expect(headers["x-request-id"]).toEqual("incoming-id");
  });

  it("should create a request id when the header is missing", async () => {
    const request = SuperTest(PlatformTest.callback());

    const {body, headers} = await request.get("/rest/context/id").expect(200);

    expect(body.id).toMatch(/^[0-9a-f]{32}$/);
    expect(headers["x-request-id"]).toEqual(body.id);
  });

  it("should wait for the $onRequest listeners before calling the controller", async () => {
    const ref = {};

    $on("$onRequest", ref, async ($ctx: any) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      $ctx.set("fromHook", "set by $onRequest");
    });

    try {
      const request = SuperTest(PlatformTest.callback());

      const {body} = await request.get("/rest/context/id").expect(200);

      expect(body.fromHook).toEqual("set by $onRequest");
    } finally {
      $off(ref as any);
    }
  });
});
