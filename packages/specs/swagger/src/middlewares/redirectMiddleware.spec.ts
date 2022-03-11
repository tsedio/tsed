import {PlatformTest} from "@tsed/common";
import {redirectMiddleware} from "./redirectMiddleware";

describe("redirectMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", () => {
    const ctx = PlatformTest.createRequestContext();
    jest.spyOn(ctx.response.raw, "redirect").mockReturnValue(undefined);
    ctx.request.raw.url = "/path";
    ctx.request.raw.originalUrl = "/path";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.raw.redirect).toHaveBeenCalledWith(302, "/path/");
  });
  it("should create a middleware and call next", () => {
    const ctx = PlatformTest.createRequestContext();
    jest.spyOn(ctx.response.raw, "redirect");
    ctx.request.raw.url = "/path/";
    ctx.request.raw.originalUrl = "/path/";

    redirectMiddleware("/path")(ctx);

    expect(ctx.response.raw.redirect).not.toHaveBeenCalled();
  });
});
