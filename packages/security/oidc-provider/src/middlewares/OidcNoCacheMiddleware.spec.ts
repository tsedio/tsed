import {PlatformTest} from "@tsed/common";
import {OidcNoCacheMiddleware} from "./OidcNoCacheMiddleware.js";

describe("OidcNoCacheMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should add headers", () => {
    const middleware = PlatformTest.get<OidcNoCacheMiddleware>(OidcNoCacheMiddleware);
    const ctx = PlatformTest.createRequestContext();
    vi.spyOn(ctx.response, "setHeader").mockReturnThis();

    middleware.use(ctx);

    expect(ctx.response.setHeader).toBeCalledWith("Pragma", "no-cache");
    expect(ctx.response.setHeader).toBeCalledWith("Cache-Control", "no-cache, no-store");
  });
});
