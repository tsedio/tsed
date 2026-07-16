import {OidcNoCacheMiddleware} from "./OidcNoCacheMiddleware.js";
import {PlatformTest} from "@tsed/platform-http/testing";

describe("OidcNoCacheMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should add headers", () => {
    const middleware = PlatformTest.get<OidcNoCacheMiddleware>(OidcNoCacheMiddleware);
    const ctx = PlatformTest.createRequestContext();
    vi.spyOn(ctx.response, "setHeader").mockReturnThis();

    middleware.use(ctx);

    expect(ctx.response.setHeader).toHaveBeenCalledWith("Pragma", "no-cache");
    expect(ctx.response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache, no-store");
  });
});
