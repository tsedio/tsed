import {PlatformTest} from "@tsed/platform-http/testing";

import {indexMiddleware} from "./indexMiddleware.js";

describe("indexMiddleware and redirect", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should create a middleware", async () => {
    const ctx = PlatformTest.createRequestContext();
    vi.spyOn(ctx.response, "render").mockResolvedValue("");

    const viewPath = "/swagger.ejs";
    const conf = {
      path: "/doc",
      options: {},
      showExplorer: false,
      cssPath: "/path.css",
      jsPath: "/path.js",
      urls: []
    };

    await indexMiddleware(viewPath, conf)(ctx);

    expect(ctx.response.render).toHaveBeenCalledWith(viewPath, {
      spec: {},
      cssPath: "/path.css",
      jsPath: "/path.js",
      showExplorer: false,
      swaggerOptions: {},
      url: "/doc/swagger.json",
      urls: []
    });
  });
});
