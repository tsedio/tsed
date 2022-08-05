import {PlatformTest} from "@tsed/common";
import {renderPage} from "vite-plugin-ssr";

import {ViteService} from "./ViteService";

jest.mock("vite-plugin-ssr");

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

  (renderPage as jest.Mock).mockResolvedValue(pageContext);

  return {service, $ctx, pageContext, stateSnapshot: PlatformTest.injector.settings.get("stateSnapshot")};
}

describe("ViteService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    return PlatformTest.create({
      vite: {root: "./path/to/client", stateSnapshot: jest.fn().mockReturnValue({state: "state"})}
    });
  });
  afterEach(() => PlatformTest.reset());
  describe("render()", () => {
    it("should render the page", async () => {
      const {$ctx, service} = await getServiceFixture({
        statusCode: 200,
        contentType: "text/html",
        body: "html"
      });

      jest.spyOn($ctx.response, "status").mockReturnThis();
      jest.spyOn($ctx.response, "setHeader").mockReturnThis();

      const result = await service.render("*", $ctx);

      expect(result).toEqual("html");
      expect(renderPage).toHaveBeenCalledWith({
        pageProps: {
          view: "*"
        },
        contextProps: {
          data: {
            view: "*"
          },
          view: "*",
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
        url: "/"
      });
      expect($ctx.response.status).toHaveBeenCalledWith(200);
      expect($ctx.response.setHeader).toHaveBeenCalledWith("Content-Type", "text/html");
    });
    it("should return empty content if the page doesn't contains jsx content", async () => {
      const {$ctx, service} = await getServiceFixture(null);

      jest.spyOn($ctx.response, "status").mockReturnThis();
      jest.spyOn($ctx.response, "body").mockReturnThis();
      jest.spyOn($ctx.response, "setHeader").mockReturnThis();

      const result = await service.render("vue.vite", $ctx);

      expect(result).toEqual(undefined);
      expect(renderPage).toHaveBeenCalledWith({
        pageProps: {
          view: "vue"
        },
        contextProps: {
          data: {
            view: "vue"
          },
          headers: {
            host: "host",
            "x-header": "x-header"
          },
          view: "vue",
          host: "host",
          method: "GET",
          protocol: "https",
          secure: true,
          session: {},
          stateSnapshot: {state: "state"},
          url: "/"
        },
        url: "/"
      });
      expect($ctx.response.status).not.toHaveBeenCalled();
      expect($ctx.response.setHeader).not.toHaveBeenCalled();
      expect($ctx.response.body).not.toHaveBeenCalled();
    });
  });
});
