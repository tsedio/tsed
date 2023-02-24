import {PlatformTest} from "@tsed/common";

import {ViteService} from "../services/ViteService";
import {ViteRendererMiddleware} from "./ViteRendererMiddleware";

describe("ViteRenderMiddleware", () => {
  describe("use()", () => {
    describe("when enableStream: false", () => {
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
          renderPage: jest.fn()
        };

        const $ctx = PlatformTest.createRequestContext();
        jest.spyOn($ctx.response, "body");

        viteService.renderPage.mockResolvedValue({
          httpResponse: {
            statusCode: 200,
            nothingRendered: false,
            renderResult: "result",
            body: "result"
          }
        });

        const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
          {
            token: ViteService,
            use: viteService
          }
        ]);

        await middleware.use($ctx);

        expect(viteService.renderPage).toHaveBeenCalledWith("*", $ctx);
        expect($ctx.response.body).toHaveBeenCalledWith("result");
      });
    });
    describe("when enableStream: true", () => {
      beforeEach(() =>
        PlatformTest.create({
          vite: {
            enableStream: true,
            root: __dirname
          }
        })
      );
      afterEach(() => PlatformTest.reset());
      it("should return the response", async () => {
        const viteService = {
          renderPage: jest.fn()
        };

        const $ctx = PlatformTest.createRequestContext();
        jest.spyOn($ctx.response, "stream");

        const pageContext = {
          httpResponse: {
            statusCode: 200,
            nothingRendered: false,
            renderResult: "result",
            body: "result",
            pipe: jest.fn()
          }
        };

        viteService.renderPage.mockResolvedValue(pageContext);

        const middleware = await PlatformTest.invoke<ViteRendererMiddleware>(ViteRendererMiddleware, [
          {
            token: ViteService,
            use: viteService
          }
        ]);

        await middleware.use($ctx);

        expect(viteService.renderPage).toHaveBeenCalledWith("*", $ctx);
        expect($ctx.response.stream).toHaveBeenCalledWith(pageContext.httpResponse);
      });
    });
  });
});
