import {PlatformTest} from "@tsed/common";

import {ViteService} from "../services/ViteService";
import {ViteRendererMiddleware} from "./ViteRendererMiddleware";

describe("ViteRenderMiddleware", () => {
  describe("use()", () => {
    beforeEach(() =>
      PlatformTest.create({
        vite: {
          root: __dirname
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should return the response", async () => {
      const viteService = {
        render: jest.fn()
      };

      const $ctx = PlatformTest.createRequestContext();
      jest.spyOn($ctx.response, "body");

      viteService.render.mockResolvedValue("result");

      const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
        {
          token: ViteService,
          use: viteService
        }
      ]);

      await middleware.use($ctx);

      expect(viteService.render).toHaveBeenCalledWith("*", $ctx);
      expect($ctx.response.body).toHaveBeenCalledWith("result");
    });
  });
});
