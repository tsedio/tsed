import {PlatformTest} from "@tsed/common";
import filedirname from "filedirname";

import {ViteService} from "../services/ViteService";
import {ViteRendererMiddleware} from "./ViteRendererMiddleware";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

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
