import {$asyncEmit} from "@tsed/hooks";
import {PlatformResponseFilter} from "@tsed/platform-response-filter";
import {Injectable} from "@tsed/di";
import {Get, s} from "@tsed/schema";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createFetchHandler} from "./createFetchHandler.js";
import {executeFetchRoute} from "./executeFetchRoute.js";
import {PlatformHandler} from "../services/PlatformHandler.js";

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

  it("executes a compiled controller route without a host server", async () => {
    @Injectable()
    class WidgetsController {
      @Get("/")
      get() {
        return {name: "widget"};
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

    const response = await handler(new Request("https://tsed.dev/widgets"));

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
});
