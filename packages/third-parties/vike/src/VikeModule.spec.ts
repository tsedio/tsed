import {PlatformApplication, PlatformTest} from "@tsed/common";
import {PlatformViews} from "@tsed/platform-views";

import {VikeRendererMiddleware} from "./middlewares/VikeRendererMiddleware";
import {VIKE_SERVER} from "./services/VikeServer";
import {VikeService} from "./services/VikeService";
import {VikeModule} from "./VikeModule";

async function getModuleFixture() {
  const platformViews = {
    registerEngine: jest.fn()
  };
  const vikeService = {
    render: jest.fn()
  };
  const platformApplication = {
    use: jest.fn(),
    get: jest.fn()
  };
  const vikeServer = {
    middlewares: "middlewares"
  };
  const service = await PlatformTest.invoke<VikeModule>(VikeModule, [
    {
      token: VikeService,
      use: vikeService
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
      token: VIKE_SERVER,
      use: vikeServer
    }
  ]);

  return {service, vikeService, platformApplication, platformViews, vikeServer};
}

describe("ViteModule", () => {
  beforeEach(() =>
    PlatformTest.create({
      imports: [
        {
          token: VIKE_SERVER,
          use: {
            middlewares: jest.fn()
          }
        }
      ]
    })
  );
  afterEach(() => PlatformTest.reset());

  describe("$onInit()", () => {
    it("should render html", async () => {
      const {vikeService, platformViews} = await getModuleFixture();
      vikeService.render.mockResolvedValue("html");
      expect(platformViews.registerEngine).toHaveBeenCalledWith("vike", {options: {}, render: expect.any(Function)});

      const result = await platformViews.registerEngine.mock.calls[0][1].render("path.vike", {$ctx: {}});

      expect(result).toEqual("html");
      expect(vikeService.render).toHaveBeenCalledWith("path.vike", {$ctx: {}});
    });

    it("should render empty content", async () => {
      const {vikeService, platformViews} = await getModuleFixture();

      vikeService.render.mockResolvedValue(undefined);

      expect(platformViews.registerEngine).toHaveBeenCalledWith("vike", {options: {}, render: expect.any(Function)});

      const result = await platformViews.registerEngine.mock.calls[0][1].render("path.vike", {$ctx: {}});

      expect(result).toEqual("");
      expect(vikeService.render).toHaveBeenCalledWith("path.vike", {$ctx: {}});
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

      expect(platformApplication.get).toHaveBeenCalledWith("*", VikeRendererMiddleware);
    });
  });
});
