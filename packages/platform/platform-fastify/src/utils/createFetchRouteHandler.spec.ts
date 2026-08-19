import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Readable} from "node:stream";
import {createFetchRouteHandler} from "./createFetchRouteHandler.js";

describe("createFetchRouteHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes a Fastify-selected route with native capabilities and parsed body access", async () => {
    const raw = {write: vi.fn().mockReturnValue(true), end: vi.fn((callback?: () => void) => callback?.()), once: vi.fn()};
    const request = {
      protocol: "https",
      hostname: "api.tsed.dev",
      method: "POST",
      url: "/widgets/42",
      headers: {host: "api.tsed.dev"},
      params: {id: "42"},
      body: {name: "widget"},
      raw: Readable.from([])
    };
    const reply = {raw, code: vi.fn(), header: vi.fn(), setCookie: vi.fn(), clearCookie: vi.fn()};
    const handler = createFetchRouteHandler([
      new PlatformHandlerMetadata({
        type: PlatformHandlerType.CTX_FN,
        handler: ($ctx: any) => {
          expect($ctx.request.native).toBe(request);
          expect($ctx.response.native).toBe(reply);
          expect($ctx.request.params).toEqual({id: "42"});
          expect($ctx.request.body).toEqual({name: "widget"});
          $ctx.response.status(201).body("created");
        }
      })
    ]);

    await handler(request as any, reply as any);

    expect(reply.code).toHaveBeenCalledWith(201);
    expect(raw.end).toHaveBeenCalledOnce();
  });
});
