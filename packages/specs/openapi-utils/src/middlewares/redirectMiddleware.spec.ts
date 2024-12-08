import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {redirectMiddleware} from "./redirectMiddleware.js";

describe("redirectMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", async () => {
    const ctx = PlatformTest.createRequestContext();
    vi.spyOn(ctx.response, "redirect").mockReturnValue(undefined as never);

    ctx.request.raw.url = "/path";
    ctx.request.raw.originalUrl = "/path";
    ctx.request.raw.method = "GET";

    await runInContext(ctx, () => redirectMiddleware("/path")());

    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "/path/");
  });
  it("should create a middleware and call next", async () => {
    const ctx = PlatformTest.createRequestContext();
    vi.spyOn(ctx.response, "redirect");
    ctx.request.raw.url = "/path/";
    ctx.request.raw.method = "GET";
    ctx.request.raw.originalUrl = "/path/";

    await runInContext(ctx, () => redirectMiddleware("/path")());

    expect(ctx.response.redirect).not.toHaveBeenCalled();
  });
});
