import {PlatformContext} from "../domain/PlatformContext.js";
import {PlatformTest} from "../../testing/PlatformTest.js";

function createResponse() {
  const ctx = new PlatformContext({
    event: {request: PlatformTest.createRequest(), response: undefined} as any,
    fetch: new Request("https://tsed.dev/"),
    id: "id"
  });

  return {ctx, response: ctx.response};
}

describe("PlatformResponse", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("keeps host objects as explicit raw/native aliases", () => {
    const native = {};
    const ctx = new PlatformContext({event: {request: PlatformTest.createRequest(), response: native} as any, id: "id"});

    expect(ctx.response.native).toBe(native);
    expect(ctx.response.raw).toBe(ctx.response.native);
  });

  it("materializes status, headers and a JSON body as one Fetch response", async () => {
    const {response} = createResponse();
    response.status(201).setHeader("x-token", "token").body({created: true});

    const result = response.finalize();
    expect(result.status).toBe(201);
    expect(result.headers.get("x-request-id")).toBe("id");
    expect(result.headers.get("x-token")).toBe("token");
    await expect(result.json()).resolves.toEqual({created: true});
  });

  it("does not mutate the native response while building portable state", () => {
    const native = {status: vi.fn(), set: vi.fn(), send: vi.fn()};
    const ctx = new PlatformContext({event: {request: PlatformTest.createRequest(), response: native} as any, id: "id"});
    ctx.response.status(204).setHeader("x-token", "token").body("done");

    expect(native.status).not.toHaveBeenCalled();
    expect(native.set).not.toHaveBeenCalled();
    expect(native.send).not.toHaveBeenCalled();
  });

  it("requires a standard ReadableStream", () => {
    const {response} = createResponse();
    const nodeStream = {pipe() {}};

    expect(() => response.body(nodeStream)).toThrow("requires a standard ReadableStream");
  });

  it("builds redirects without accessing the host response", async () => {
    const {response} = createResponse();
    response.redirect(302, "/login");

    const result = response.finalize();
    expect(result.status).toBe(302);
    expect(result.headers.get("location")).toBe("/login");
    await expect(result.text()).resolves.toContain("Redirecting to /login");
  });

  it("stores cookie mutations without serializing them", () => {
    const {response} = createResponse();
    response.cookie("locale", "fr-FR", {httpOnly: true, sameSite: "lax"});
    response.cookie("locale", null, {path: "/"});

    expect([...response.getCookies().values()]).toEqual([{name: "locale", value: null, options: {path: "/"}}]);
    expect(response.finalize().headers.get("set-cookie")).toBeNull();
  });

  it("rejects mutations after finalization", () => {
    const {response} = createResponse();
    response.finalize();
    expect(() => response.status(204)).toThrow("PlatformResponse has already been finalized");
  });
});
