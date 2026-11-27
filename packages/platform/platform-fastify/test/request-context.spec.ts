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

  const ref = {};
  afterEach(() => $off(ref as any));

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
    $on("$onRequest", ref, async ($ctx: any) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      $ctx.set("fromHook", "set by $onRequest");
    });

    const request = SuperTest(PlatformTest.callback());

    const {body} = await request.get("/rest/context/id").expect(200);

    expect(body.fromHook).toEqual("set by $onRequest");
  });

  it("should emit $onResponse and finish the context once the response is sent", async () => {
    let resolveFinished: (ctx: any) => void;
    const finished = new Promise<any>((resolve) => (resolveFinished = resolve));

    $on("$onResponse", ref, ($ctx: any) => {
      setImmediate(() => resolveFinished($ctx));
    });

    const request = SuperTest(PlatformTest.callback());

    const {body} = await request.get("/rest/context/id").expect(200);
    const $ctx = await finished;

    expect($ctx.id).toEqual(body.id);
    expect($ctx.isFinished()).toEqual(true);
    expect($ctx.getReq().$ctx).toBeUndefined();
  });

  it("should finish the context only once when the response emits error after finish", async () => {
    const onResponse = vi.fn();
    let resolveFinished: () => void;
    const finished = new Promise<void>((resolve) => (resolveFinished = resolve));

    $on("$onResponse", ref, ($ctx: any) => {
      onResponse($ctx.id);
      $ctx.getRes().emit("error", new Error("after finish"));
      setImmediate(() => resolveFinished());
    });

    const request = SuperTest(PlatformTest.callback());

    await request.get("/rest/context/id").expect(200);
    await finished;

    expect(onResponse).toHaveBeenCalledTimes(1);
  });
});
