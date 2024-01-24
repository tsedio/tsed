import {PlatformTest} from "@tsed/common";
import filedirname from "filedirname";

import {VikeService} from "../services/VikeService";
import {VikeRendererMiddleware} from "./VikeRendererMiddleware";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

describe("ViteRenderMiddleware", () => {
  describe("use()", () => {
    beforeEach(() =>
      PlatformTest.create({
        vike: {
          root: rootDir
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should return the response", async () => {
      const vikeService = {
        render: jest.fn()
      };

      const $ctx = PlatformTest.createRequestContext();
      jest.spyOn($ctx.response, "body");

      vikeService.render.mockResolvedValue("result");
      jest.spyOn($ctx.response, "isDone").mockReturnValue(false);

      const middleware = await PlatformTest.invoke<VikeRendererMiddleware>(VikeRendererMiddleware, [
        {
          token: VikeService,
          use: vikeService
        }
      ]);

      await middleware.use($ctx);

      expect(vikeService.render).toHaveBeenCalledWith("*", {$ctx});
      expect($ctx.response.body).toHaveBeenCalledWith("result");
    });
    it("should not return the response", async () => {
      const vikeService = {
        render: jest.fn()
      };

      const $ctx = PlatformTest.createRequestContext();
      jest.spyOn($ctx.response, "body");
      jest.spyOn($ctx.response, "isDone").mockReturnValue(true);

      vikeService.render.mockResolvedValue("result");

      const middleware = await PlatformTest.invoke<VikeRendererMiddleware>(VikeRendererMiddleware, [
        {
          token: VikeService,
          use: vikeService
        }
      ]);

      await middleware.use($ctx);

      expect(vikeService.render).toHaveBeenCalledWith("*", {$ctx});
      expect($ctx.response.body).not.toHaveBeenCalled();
    });
  });
});
