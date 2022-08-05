import {PlatformTest} from "@tsed/common";

import {ViteService} from "../services/ViteService";
import {ViteRendererMiddleware} from "./ViteRendererMiddleware";

describe("ViteRenderMiddleware", () => {
  beforeEach(() =>
    PlatformTest.create({
      vite: {
        root: __dirname
      }
    })
  );
  afterEach(() => PlatformTest.reset());
  describe("use()", () => {
    it("should return the response", async () => {
      const viteService = {
        render: jest.fn()
      };

      const $ctx = PlatformTest.createRequestContext();

      viteService.render.mockResolvedValue({statusCode: 200, nothingRendered: false, renderResult: "result"});

      const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
        {
          token: ViteService,
          use: viteService
        }
      ]);

      await middleware.use($ctx);

      expect(viteService.render).toHaveBeenCalledWith("*", $ctx);
    });
  });
});
