import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createFetchRoutesHandler} from "./createFetchRoutesHandler.js";

describe("createFetchRoutesHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("matches a Fetch request and exposes portable path and query parameters", async () => {
    const layer = new PlatformLayer({
      method: "get",
      path: "/widgets/:id",
      handlers: [
        new PlatformHandlerMetadata({
          handler: ($ctx: any) => $ctx.response.json({id: $ctx.request.params.id, query: $ctx.request.query})
        })
      ]
    });
    const handler = createFetchRoutesHandler([layer]);

    const response = await handler(new Request("https://tsed.dev/widgets/42?tag=one&tag=two"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({id: "42", query: {tag: ["one", "two"]}});
  });

  it("returns a standard not-found response", async () => {
    const handler = createFetchRoutesHandler([]);

    const response = await handler(new Request("https://tsed.dev/missing"));

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
  });
});
