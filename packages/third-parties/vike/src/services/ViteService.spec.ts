import {PlatformTest} from "@tsed/platform-http/testing";

import {ViteService} from "./ViteService.js";

vi.mock("vike/server", () => {
  return {
    renderPage: vi.fn()
  };
});

async function getServiceFixture(httpResponse: any) {
  const $ctx = PlatformTest.createRequestContext();

  const service = await PlatformTest.invoke<ViteService>(ViteService, []);

  $ctx.request.req.method = "GET";
  $ctx.request.req.url = "/";
  // @ts-ignore
  $ctx.request.req.session = {};
  // @ts-ignore
  $ctx.request.req.secure = true;
  // @ts-ignore
  $ctx.request.req.protocol = "https";
  $ctx.request.req.headers = {
    host: "host",
    "x-header": "x-header",
    "user-agent": "ua"
  };

  const pageContext = {
    httpResponse
  };
  const mod = await import("vike/server");

  vi.mocked(mod.renderPage).mockResolvedValue(pageContext as never);

  return {
    renderPage: mod.renderPage,
    service,
    $ctx,
    pageContext,
    stateSnapshot: PlatformTest.injector.settings.get("stateSnapshot")
  };
}

describe("ViteService", () => {
  describe("render()", () => {
    describe("when the enableStream: false", () => {
      beforeEach(() => {
        vi.resetAllMocks();
        return PlatformTest.create({
          vite: {root: "./path/to/client", stateSnapshot: vi.fn().mockReturnValue({state: "state"})}
        });
      });
      afterEach(() => PlatformTest.reset());

      it("should render the page", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture({
          statusCode: 200,
          headers: [["content-type", "text/html"]],
          body: "html"
        });

        vi.spyOn($ctx.response, "status").mockReturnThis();
        vi.spyOn($ctx.response, "setHeader").mockReturnThis();

        const result = await service.render("*", {$ctx});

        expect(result).toEqual("html");
        expect(renderPage).toHaveBeenCalledWith({
          view: "*",
          pageProps: {
            view: "*"
          },
          contextProps: {
            headers: {
              host: "host",
              "x-header": "x-header",
              "user-agent": "ua"
            },
            host: "host",
            method: "GET",
            protocol: "https",
            secure: true,
            session: {},
            stateSnapshot: {state: "state"},
            url: "/"
          },
          urlOriginal: "/",
          userAgent: "ua"
        });
        expect($ctx.response.status).toHaveBeenCalledWith(200);
        expect($ctx.response.setHeader).toHaveBeenCalledWith("content-type", "text/html");
      });
      it("should return empty content if the page doesn't contains jsx content", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture(null);

        vi.spyOn($ctx.response, "status").mockReturnThis();
        vi.spyOn($ctx.response, "body").mockReturnThis();
        vi.spyOn($ctx.response, "contentType").mockReturnThis();

        const result = await service.render("vue.vite", {$ctx, valueOpt: "valueOpt"});

        expect(result).toEqual(undefined);
        expect(renderPage).toHaveBeenCalledWith(
          expect.objectContaining({
            view: "vue",
            pageProps: {
              view: "vue",
              valueOpt: "valueOpt"
            },
            contextProps: {
              headers: {
                host: "host",
                "x-header": "x-header",
                "user-agent": "ua"
              },
              host: "host",
              method: "GET",
              protocol: "https",
              secure: true,
              session: {},
              stateSnapshot: {state: "state"},
              url: "/"
            },
            urlOriginal: "/",
            userAgent: "ua"
          })
        );
        expect($ctx.response.status).not.toHaveBeenCalled();
        expect($ctx.response.contentType).not.toHaveBeenCalled();
        expect($ctx.response.body).not.toHaveBeenCalled();
      });
      it("should log render error", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture(null);

        vi.spyOn($ctx.logger, "error").mockReturnThis();

        (renderPage as any).mockResolvedValue({
          httpResponse: {},
          errorWhileRendering: new Error("")
        });

        vi.spyOn($ctx.response, "status").mockReturnThis();
        vi.spyOn($ctx.response, "body").mockReturnThis();
        vi.spyOn($ctx.response, "setHeader").mockReturnThis();

        await service.render("vue.vite", {$ctx});

        expect($ctx.logger.error).toHaveBeenCalled();
      });
    });

    describe("when the enableStream: true", () => {
      beforeEach(() => {
        vi.resetAllMocks();
        return PlatformTest.create({
          vite: {
            enableStream: true,
            root: "./path/to/client",
            stateSnapshot: vi.fn().mockReturnValue({state: "state"})
          }
        });
      });
      afterEach(() => PlatformTest.reset());

      it("should render the page", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture({
          statusCode: 200,
          headers: [["content-type", "text/html"]],
          body: "html"
        });

        vi.spyOn($ctx.response, "status").mockReturnThis();
        vi.spyOn($ctx.response, "setHeader").mockReturnThis();

        const result = await service.render("*", {$ctx});

        expect(result).toEqual({
          body: "html",
          headers: [["content-type", "text/html"]],
          statusCode: 200
        });
        expect(renderPage).toHaveBeenCalledWith({
          view: "*",
          pageProps: {
            view: "*"
          },
          contextProps: {
            headers: {
              host: "host",
              "x-header": "x-header",
              "user-agent": "ua"
            },
            host: "host",
            method: "GET",
            protocol: "https",
            secure: true,
            session: {},
            stateSnapshot: {state: "state"},
            url: "/"
          },
          urlOriginal: "/",
          userAgent: "ua"
        });
        expect($ctx.response.status).toHaveBeenCalledWith(200);
        expect($ctx.response.setHeader).toHaveBeenCalledWith("content-type", "text/html");
      });

      it("should render the page with statusCode from context.response if superior to httpResponse.statusCode", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture({
          statusCode: 200,
          headers: [["content-type", "text/html"]],
          body: "html"
        });

        $ctx.response.status(404);
        vi.spyOn($ctx.response, "status").mockReturnThis();
        vi.spyOn($ctx.response, "setHeader").mockReturnThis();
        const result = await service.render("*", {$ctx});

        expect(result).toEqual({
          body: "html",
          headers: [["content-type", "text/html"]],
          statusCode: 200
        });
        expect(renderPage).toHaveBeenCalledWith({
          view: "*",
          pageProps: {
            view: "*"
          },
          contextProps: {
            headers: {
              host: "host",
              "x-header": "x-header",
              "user-agent": "ua"
            },
            host: "host",
            method: "GET",
            protocol: "https",
            secure: true,
            session: {},
            stateSnapshot: {state: "state"},
            url: "/"
          },
          urlOriginal: "/",
          userAgent: "ua"
        });
        expect($ctx.response.status).toHaveBeenCalledWith(404);
        expect($ctx.response.setHeader).toHaveBeenCalledWith("content-type", "text/html");
      });
    });
  });
});
