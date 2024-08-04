import {PlatformTest} from "@tsed/common";
import {redirectMiddleware} from "./redirectMiddleware.js";

describe("redirectMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", () => {
    const ctx = PlatformTest.createRequestContext();
    jest.spyOn(ctx.response, "redirect").mockReturnValue(undefined as never);

    ctx.request.raw.url = "/path";
    ctx.request.raw.originalUrl = "/path";
    ctx.request.raw.method = "GET";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.redirect).toHaveBeenCalledWith(302, "/path/");
  });
  it("should create a middleware and call next", () => {
    const ctx = PlatformTest.createRequestContext();
    jest.spyOn(ctx.response, "redirect");
    ctx.request.raw.url = "/path/";
    ctx.request.raw.method = "GET";
    ctx.request.raw.originalUrl = "/path/";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.redirect).not.toHaveBeenCalled();
  });
});
