import {PlatformApplication} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformViews} from "@tsed/platform-views";

import {ViteRendererMiddleware} from "./middlewares/ViteRendererMiddleware.js";
import {VITE_SERVER} from "./services/ViteServer.js";
import {ViteService} from "./services/ViteService.js";
import {ViteModule} from "./ViteModule.js";

async function getModuleFixture() {
  const platformViews = {
    registerEngine: vi.fn()
  };
  const viteService = {
    render: vi.fn()
  };
  const platformApplication = {
    use: vi.fn(),
    get: vi.fn()
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
  beforeEach(() =>
    PlatformTest.create({
      imports: [
        {
          token: VITE_SERVER,
          use: {
            middlewares: vi.fn()
          }
        }
      ]
    })
  );
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
