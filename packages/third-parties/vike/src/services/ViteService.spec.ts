import {PlatformTest} from "@tsed/common";
import {ViteService} from "./ViteService";

jest.mock("vike/server", () => {
  return {
    renderPage: jest.fn()
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
    "x-header": "x-header"
  };

  const pageContext = {
    httpResponse
  };
  const mod = await import("vike/server");

  (mod.renderPage as jest.Mock).mockResolvedValue(pageContext);

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
        jest.resetAllMocks();
        return PlatformTest.create({
          vite: {root: "./path/to/client", stateSnapshot: jest.fn().mockReturnValue({state: "state"})}
        });
      });
      afterEach(() => PlatformTest.reset());

      it("should render the page", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture({
          statusCode: 200,
          headers: [["content-type", "text/html"]],
          body: "html"
        });

        jest.spyOn($ctx.response, "status").mockReturnThis();
        jest.spyOn($ctx.response, "setHeader").mockReturnThis();

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
              "x-header": "x-header"
            },
            host: "host",
            method: "GET",
            protocol: "https",
            secure: true,
            session: {},
            stateSnapshot: {state: "state"},
            url: "/"
          },
          urlOriginal: "/"
        });
        expect($ctx.response.status).toHaveBeenCalledWith(200);
        expect($ctx.response.setHeader).toHaveBeenCalledWith("content-type", "text/html");
      });
      it("should return empty content if the page doesn't contains jsx content", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture(null);

        jest.spyOn($ctx.response, "status").mockReturnThis();
        jest.spyOn($ctx.response, "body").mockReturnThis();
        jest.spyOn($ctx.response, "contentType").mockReturnThis();

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
                "x-header": "x-header"
              },
              host: "host",
              method: "GET",
              protocol: "https",
              secure: true,
              session: {},
              stateSnapshot: {state: "state"},
              url: "/"
            },
            urlOriginal: "/"
          })
        );
        expect($ctx.response.status).not.toHaveBeenCalled();
        expect($ctx.response.contentType).not.toHaveBeenCalled();
        expect($ctx.response.body).not.toHaveBeenCalled();
      });
      it("should log render error", async () => {
        const {$ctx, service, renderPage} = await getServiceFixture(null);

        jest.spyOn($ctx.logger, "error").mockReturnThis();

        (renderPage as any).mockResolvedValue({
          httpResponse: {},
          errorWhileRendering: new Error("")
        });

        jest.spyOn($ctx.response, "status").mockReturnThis();
        jest.spyOn($ctx.response, "body").mockReturnThis();
        jest.spyOn($ctx.response, "setHeader").mockReturnThis();

        await service.render("vue.vite", {$ctx});

        expect($ctx.logger.error).toHaveBeenCalled();
      });
    });

    describe("when the enableStream: true", () => {
      beforeEach(() => {
        jest.resetAllMocks();
        return PlatformTest.create({
          vite: {
            enableStream: true,
            root: "./path/to/client",
            stateSnapshot: jest.fn().mockReturnValue({state: "state"})
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

        jest.spyOn($ctx.response, "status").mockReturnThis();
        jest.spyOn($ctx.response, "setHeader").mockReturnThis();

        const result = await service.render("*", {$ctx});

        expect(result).toEqual({
          body: "html",
          "headers": [
            ["content-type", "text/html"]
          ],
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
              "x-header": "x-header"
            },
            host: "host",
            method: "GET",
            protocol: "https",
            secure: true,
            session: {},
            stateSnapshot: {state: "state"},
            url: "/"
          },
          urlOriginal: "/"
        });
        expect($ctx.response.status).toHaveBeenCalledWith(200);
        expect($ctx.response.setHeader).toHaveBeenCalledWith("content-type", "text/html");
      });
    });
  });
});
