import {configuration} from "@tsed/di";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {createContext} from "../utils/createContext.js";
import {PlatformApplication} from "./PlatformApplication.js";
import {PlatformHandler} from "./PlatformHandler.js";

vi.mock("../utils/createContext");

function createDriver() {
  return {
    use: vi.fn(),
    all: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    head: vi.fn(),
    options: vi.fn()
  };
}

async function getPlatformApp() {
  const platformHandler = {
    createHandler: vi.fn().mockImplementation((o) => o)
  };
  const platformApp = await PlatformTest.invoke<PlatformApplication<any>>(PlatformApplication, [
    {
      token: PlatformHandler,
      use: platformHandler
    }
  ]);
  configuration().logger = {};
  platformApp.rawApp = createDriver() as any;
  vi.spyOn(platformApp, "multer").mockReturnValue({} as never);

  return {platformApp, platformHandler};
}

describe("PlatformApplication", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("getApp()", () => {
    it("should return app", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      expect(platformApp.getApp()).toEqual(platformApp.rawApp);
    });
  });

  describe("statics()", () => {
    it("should call statics", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      vi.spyOn(console, "warn");

      // WHEN
      platformApp.statics("/", {root: "/root"});
    });
  });
  describe("multer()", () => {
    it("should call statics", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      vi.spyOn(console, "warn");

      // WHEN
      platformApp.multer({});
    });
  });

  describe("callback()", () => {
    it("should return the callback", async () => {
      const $ctx = {
        runInContext: vi.fn().mockImplementation((cb) => {
          cb();
        })
      };

      const {platformApp} = await getPlatformApp();

      (createContext as any).mockReturnValue(() => Promise.resolve($ctx));

      // WHEN
      const callback = vi.fn();

      vi.spyOn(platformApp, "rawCallback").mockReturnValue(callback);

      await platformApp.callback({} as any, {} as any);

      expect(platformApp.rawCallback).toHaveBeenCalledWith();
      expect(callback).toHaveBeenCalledWith({}, {});
    });
  });
});
