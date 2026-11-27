import {PlatformTest} from "@tsed/platform-http/testing";
import {methodNotAllowed} from "./methodNotAllowed.js";

describe("methodNotAllowed()", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("answers 405 with the allowed method and a JSON-RPC error", () => {
    const $ctx = PlatformTest.createRequestContext();
    const status = vi.spyOn($ctx.response, "status").mockReturnThis();
    const setHeaders = vi.spyOn($ctx.response, "setHeaders").mockReturnThis();
    const body = vi.spyOn($ctx.response, "body").mockReturnThis();

    expect(methodNotAllowed($ctx)).toBe($ctx.response);
    expect(status).toHaveBeenCalledWith(405);
    expect(setHeaders).toHaveBeenCalledWith({allow: "POST"});
    expect(body).toHaveBeenCalledWith({jsonrpc: "2.0", error: {code: -32000, message: "Method not allowed."}, id: null});
  });

  it("lists the given methods in the Allow header", () => {
    const $ctx = PlatformTest.createRequestContext();
    const setHeaders = vi.spyOn($ctx.response, "setHeaders").mockReturnThis();

    vi.spyOn($ctx.response, "status").mockReturnThis();
    vi.spyOn($ctx.response, "body").mockReturnThis();

    methodNotAllowed($ctx, "POST, OPTIONS");

    expect(setHeaders).toHaveBeenCalledWith({allow: "POST, OPTIONS"});
  });
});
