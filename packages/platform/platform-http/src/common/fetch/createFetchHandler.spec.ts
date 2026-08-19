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
});
