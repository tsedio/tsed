import {$asyncEmit} from "@tsed/hooks";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {Controller, Injectable, Intercept, Interceptor} from "@tsed/di";
import {Use, UseAfter, UseBefore} from "@tsed/platform-middlewares";
import {Get, s} from "@tsed/schema";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {QueryParams} from "@tsed/platform-params";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createFetchHandler} from "./createFetchHandler.js";
import {executeFetchRoute} from "./executeFetchRoute.js";
import {PlatformHandler} from "../services/PlatformHandler.js";
import {Platform} from "../services/Platform.js";
import {PlatformResponse} from "../services/PlatformResponse.js";

vi.mock("@tsed/hooks", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tsed/hooks")>();
  return {...mod, $asyncEmit: vi.fn()};
});

describe("createFetchHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("executes portable work and finalizes one standard Response", async () => {
    const handler = createFetchHandler(($ctx) => {
      $ctx.response.status(201).setHeader("x-handler", "fetch").body("created");
    });

    const response = await handler(new Request("https://tsed.dev/widgets", {headers: {"x-request-id": "request-id"}}));

    expect(response.status).toBe(201);
    expect(response.headers.get("x-handler")).toBe("fetch");
    expect(response.headers.get("x-request-id")).toBe("request-id");
    expect(await response.text()).toBe("created");
    expect($asyncEmit).toHaveBeenCalledWith("$onRequest", [expect.anything()]);
    expect($asyncEmit).toHaveBeenCalledWith("$onResponse", [expect.anything()]);
  });

  it("forwards Fetch runtime facilities without native host objects", async () => {
    const controller = new AbortController();
    const waitUntil = vi.fn();
    const runtime = {signal: controller.signal, waitUntil};
    const task = Promise.resolve();
    const handler = createFetchHandler(($ctx) => {
      expect($ctx.runtime).toBe(runtime);
      expect($ctx.request.native).toBeUndefined();
      expect($ctx.response.native).toBeUndefined();
      $ctx.runtime?.waitUntil?.(task);
      $ctx.response.body("ok");
    });

    const response = await handler(new Request("https://tsed.dev/widgets"), runtime);

    expect(await response.text()).toBe("ok");
    expect(waitUntil).toHaveBeenCalledWith(task);
  });

  it("executes a compiled controller route without a host server", async () => {
    @Injectable()
    class WidgetsController {
      @Get("/")
      get(@QueryParams("name") name: string) {
        return {name};
      }
    }

    PlatformTest.injector.add(WidgetsController);
    const metadata = new PlatformHandlerMetadata({
      provider: PlatformTest.injector.providers.get(WidgetsController),
      propertyKey: "get",
      type: PlatformHandlerType.ENDPOINT
    });
    metadata.compiledHandler = PlatformTest.get<PlatformHandler>(PlatformHandler).createHandler(metadata);
    const endpoint = s.store.method(WidgetsController, "get");
    const handler = createFetchHandler(
      executeFetchRoute([
        new PlatformHandlerMetadata({
          handler: ($ctx: any) => {
            $ctx.endpoint = endpoint;
          },
          type: PlatformHandlerType.CTX_FN
        }),
        metadata
      ])
    );

    const response = await handler(new Request("https://tsed.dev/widgets?name=widget"));

    expect(await response.json()).toEqual({name: "widget"});
  });

  it("applies response filters in the shared Fetch execution cycle", async () => {
    const responseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
    vi.spyOn(responseFilter, "transform").mockResolvedValue({hello: "filtered"});
    const handler = createFetchHandler(($ctx) => {
      $ctx.data = {hello: "world"};
    });

    const response = await handler(new Request("https://tsed.dev/widgets"));

    expect(responseFilter.transform).toHaveBeenCalledWith({hello: "world"}, expect.anything());
    expect(await response.json()).toEqual({hello: "filtered"});
  });

  it("converts a thrown error through the Ts.ED exception pipeline", async () => {
    const handler = createFetchHandler(() => {
      throw new Error("boom");
    });

    const response = await handler(new Request("https://tsed.dev/widgets"));

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({name: "Error", message: "boom", status: 500});
  });

  it("does not consume or parse the Fetch request body", async () => {
    const handler = createFetchHandler(($ctx) => {
      $ctx.response.json({body: $ctx.request.body});
    });
    const request = new Request("https://tsed.dev/widgets", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({name: "original"})
    });

    const response = await handler(request);

    expect(await response.json()).toEqual({});
    expect(await request.json()).toEqual({name: "original"});
  });

  it("preserves the portable Use* order around an intercepted endpoint", async () => {
    const calls: string[] = [];
    const responseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);
    vi.spyOn(responseFilter, "transform").mockImplementation(async (data) => {
      calls.push("response-filter");
      return data;
    });
    const finalize = PlatformResponse.prototype.finalize;
    vi.spyOn(PlatformResponse.prototype, "finalize").mockImplementation(function (this: PlatformResponse) {
      calls.push("finalization");
      return finalize.call(this);
    });

    @Interceptor()
    class RecordingInterceptor {
      intercept(context: any) {
        calls.push("interceptor:before");
        const result = context.next();
        calls.push("interceptor:after");
        return result;
      }
    }

    @Controller("/")
    @UseBefore(() => calls.push("use-before"))
    @Use(() => calls.push("use"))
    @UseAfter(() => calls.push("use-after"))
    class WidgetsController {
      @Get("/")
      @Intercept(RecordingInterceptor)
      get() {
        calls.push("endpoint");
        return "done";
      }
    }

    PlatformTest.injector.add(WidgetsController);
    const platform = PlatformTest.get<Platform>(Platform);
    platform.addRoute("/widgets", WidgetsController);
    const [layer] = platform.getLayers();
    const handler = createFetchHandler(executeFetchRoute(layer.handlers));

    const response = await handler(new Request("https://tsed.dev/widgets"));

    expect(calls).toEqual([
      "use-before",
      "use",
      "interceptor:before",
      "endpoint",
      "interceptor:after",
      "use-after",
      "response-filter",
      "finalization"
    ]);
    await expect(response.text()).resolves.toBe("done");
  });
});
