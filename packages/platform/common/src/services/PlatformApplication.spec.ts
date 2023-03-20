import {createContext} from "../utils/createContext";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformTest} from "./PlatformTest";

jest.mock("../utils/createContext");

function createDriver() {
  return {
    use: jest.fn(),
    all: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    options: jest.fn()
  };
}

async function getPlatformApp() {
  const platformHandler = {
    createHandler: jest.fn().mockImplementation((o) => o)
  };
  const platformApp = await PlatformTest.invoke<PlatformApplication<any>>(PlatformApplication, [
    {
      token: PlatformHandler,
      use: platformHandler
    }
  ]);
  platformApp.injector.settings.logger = {};
  platformApp.rawApp = createDriver() as any;

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

      jest.spyOn(console, "warn");

      // WHEN
      platformApp.statics("/", {root: "/root"});
    });
  });
  describe("multer()", () => {
    it("should call statics", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      jest.spyOn(console, "warn");

      // WHEN
      platformApp.multer({});
    });
  });

  describe("callback()", () => {
    it("should return the callback", async () => {
      const $ctx = {
        runInContext: jest.fn().mockImplementation((cb) => {
          cb();
        })
      };

      const {platformApp} = await getPlatformApp();

      (createContext as any).mockReturnValue(() => Promise.resolve($ctx));

      // WHEN
      const callback = jest.fn();

      jest.spyOn(platformApp, "rawCallback").mockReturnValue(callback);

      await platformApp.callback({} as any, {} as any);

      expect(platformApp.rawCallback).toHaveBeenCalledWith();
      expect(callback).toHaveBeenCalledWith({}, {});
    });
  });
});
