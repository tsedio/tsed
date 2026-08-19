import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformTest} from "@tsed/platform-http/testing";
import {createFetchRouteHandler} from "./createFetchRouteHandler.js";

describe("createFetchRouteHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes a route selected by Express with native capabilities attached", async () => {
    const nativeRequest = {
      protocol: "https",
      socket: {},
      method: "GET",
      originalUrl: "/widgets/42",
      headers: {host: "api.tsed.dev"},
      params: {id: "42"},
      get: (name: string) => (name === "host" ? "api.tsed.dev" : undefined)
    };
    const nativeResponse = {
      status: vi.fn(),
      set: vi.fn(),
      write: vi.fn().mockReturnValue(true),
      end: vi.fn((callback?: () => void) => callback?.()),
      once: vi.fn()
    };
    const handler = createFetchRouteHandler([
      new PlatformHandlerMetadata({
        type: PlatformHandlerType.CTX_FN,
        handler: ($ctx: any) => {
          expect($ctx.request.native).toBe(nativeRequest);
          expect($ctx.response.native).toBe(nativeResponse);
          expect($ctx.request.fetch).toBeInstanceOf(Request);
          expect($ctx.request.params).toEqual({id: "42"});
          $ctx.response.status(201).body("created");
        }
      })
    ]);

    await handler(nativeRequest as any, nativeResponse as any);

    expect(nativeResponse.status).toHaveBeenCalledWith(201);
    expect(new TextDecoder().decode(nativeResponse.write.mock.calls[0][0])).toBe("created");
    expect(nativeResponse.end).toHaveBeenCalledOnce();
  });
});
