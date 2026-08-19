import {$asyncEmit} from "@tsed/hooks";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createFetchHandler} from "./createFetchHandler.js";

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

  it("exposes a body published by explicit middleware without consuming the Request", async () => {
    const handler = createFetchHandler(async ($ctx) => {
      $ctx.request.setBody({name: "Ts.ED"});
      $ctx.response.json($ctx.request.body);
    });
    const request = new Request("https://tsed.dev/widgets", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({name: "original"})
    });

    const response = await handler(request);

    expect(await response.json()).toEqual({name: "Ts.ED"});
    expect(await request.json()).toEqual({name: "original"});
  });
});
