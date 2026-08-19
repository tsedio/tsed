import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Readable} from "node:stream";
import {createFetchRouteHandler} from "./createFetchRouteHandler.js";

describe("createFetchRouteHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes a Koa-selected route with native capabilities and parsed body access", async () => {
    const writer = {cookies: {set: vi.fn()}, set: vi.fn(), status: 200, body: undefined};
    const context = {
      protocol: "https",
      host: "api.tsed.dev",
      method: "POST",
      originalUrl: "/widgets/42",
      req: Readable.from([]),
      params: {id: "42"},
      request: {headers: {host: "api.tsed.dev"}, body: {name: "widget"}},
      response: {ctx: writer}
    };
    const handler = createFetchRouteHandler([
      new PlatformHandlerMetadata({
        type: PlatformHandlerType.CTX_FN,
        handler: ($ctx: any) => {
          expect($ctx.request.native).toBe(context.request);
          expect($ctx.response.native).toBe(context.response);
          expect($ctx.request.params).toEqual({id: "42"});
          expect($ctx.request.body).toEqual({name: "widget"});
          $ctx.response.status(201).body("created");
        }
      })
    ]);

    await handler(context as any);

    expect(writer.status).toBe(201);
    expect(writer.body).toBeDefined();
  });
});
