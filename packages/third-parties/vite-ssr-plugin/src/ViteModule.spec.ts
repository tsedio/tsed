import {PlatformApplication, PlatformTest} from "@tsed/common";
import {PlatformViews} from "@tsed/platform-views";

import {ViteRendererMiddleware} from "./middlewares/ViteRendererMiddleware";
import {VITE_SERVER} from "./services/ViteServer";
import {ViteService} from "./services/ViteService";
import {ViteModule} from "./ViteModule";

jest.mock("vite-plugin-ssr/server");
jest.mock("vite");

async function getModuleFixture() {
  const platformViews = {
    registerEngine: jest.fn()
  };
  const viteService = {
    render: jest.fn()
  };
  const platformApplication = {
    use: jest.fn(),
    get: jest.fn()
  };
  const viteServer = {
    middlewares: "middlewares"
  };
  const service = await PlatformTest.invoke<ViteModule>(ViteModule, [
    {
      token: ViteService,
      use: viteService
    },
    {
      token: PlatformApplication,
      use: platformApplication
    },
    {
      token: PlatformViews,
      use: platformViews
    },
    {
      token: VITE_SERVER,
      use: viteServer
    }
  ]);

  return {service, viteService, platformApplication, platformViews, viteServer};
}

describe("ViteModule", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("$onInit()", () => {
    it("should render html", async () => {
      const {viteService, platformViews} = await getModuleFixture();
      viteService.render.mockResolvedValue("html");
      expect(platformViews.registerEngine).toHaveBeenCalledWith("vite", {options: {}, render: expect.any(Function)});

      const result = await platformViews.registerEngine.mock.calls[0][1].render("path.vite", {$ctx: {}});

      expect(result).toEqual("html");
      expect(viteService.render).toHaveBeenCalledWith("path.vite", {$ctx: {}});
    });

    it("should render empty content", async () => {
      const {viteService, platformViews} = await getModuleFixture();

      viteService.render.mockResolvedValue(undefined);

      expect(platformViews.registerEngine).toHaveBeenCalledWith("vite", {options: {}, render: expect.any(Function)});

      const result = await platformViews.registerEngine.mock.calls[0][1].render("path.vite", {$ctx: {}});

      expect(result).toEqual("");
      expect(viteService.render).toHaveBeenCalledWith("path.vite", {$ctx: {}});
    });
  });
  describe("$afterInit()", () => {
    it("should add the middlewares", async () => {
      const {service, platformApplication} = await getModuleFixture();

      service.$afterInit();

      expect(platformApplication.use).toHaveBeenCalledWith(expect.any(Function), "middlewares");
    });
  });
  describe("$afterRoutesInit()", () => {
    it("should handle all GET routes", async () => {
      const {service, platformApplication} = await getModuleFixture();

      service.$afterRoutesInit();

      expect(platformApplication.get).toHaveBeenCalledWith("*", ViteRendererMiddleware);
    });
  });
});
