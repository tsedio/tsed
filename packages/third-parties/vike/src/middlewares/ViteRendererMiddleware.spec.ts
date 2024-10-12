import {PlatformTest} from "@tsed/platform-http/testing";

import {ViteService} from "../services/ViteService.js";
import {ViteRendererMiddleware} from "./ViteRendererMiddleware.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

describe("ViteRenderMiddleware", () => {
  describe("use()", () => {
    beforeEach(() =>
      PlatformTest.create({
        vite: {
          root: rootDir
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should return the response", async () => {
      const viteService = {
        render: vi.fn()
      };

      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.response, "body");

      viteService.render.mockResolvedValue("result");
      vi.spyOn($ctx.response, "isDone").mockReturnValue(false);

      const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
        {
          token: ViteService,
          use: viteService
        }
      ]);

      await middleware.use($ctx);

      expect(viteService.render).toHaveBeenCalledWith("*", {$ctx});
      expect($ctx.response.body).toHaveBeenCalledWith("result");
    });
    it("should not return the response", async () => {
      const viteService = {
        render: vi.fn()
      };

      const $ctx = PlatformTest.createRequestContext();
      vi.spyOn($ctx.response, "body");
      vi.spyOn($ctx.response, "isDone").mockReturnValue(true);

      viteService.render.mockResolvedValue("result");

      const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
        {
          token: ViteService,
          use: viteService
        }
      ]);

      await middleware.use($ctx);

      expect(viteService.render).toHaveBeenCalledWith("*", {$ctx});
      expect($ctx.response.body).not.toHaveBeenCalled();
    });
  });
});
