import {PlatformAdapter, PlatformHandler, PlatformRouter} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import Express from "express";

jest.mock("express");

describe("PlatformExpressRouter", () => {
  describe("create()", () => {
    it("should create a new router", async () => {
      // GIVEN
      const nativeDriver = {
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

      (Express.Router as jest.Mock).mockReturnValue(nativeDriver);

      const platformHandler = {
        createHandler: jest.fn().mockImplementation((o) => o)
      };

      const injector = new InjectorService();
      injector.addProvider(PlatformHandler, {
        useValue: platformHandler
      });

      injector.addProvider(PlatformAdapter, {
        useValue: new PlatformExpress({
          settings: injector.settings,
          injector
        } as any)
      });

      injector.settings.set("express", {
        router: {
          mergeParams: true
        }
      });

      const routerOptions: any = {
        test: "options"
      };

      // WHEN
      const router = PlatformRouter.create(injector, routerOptions);

      // THEN
      expect(Express.Router).toBeCalledWith({...injector.settings.get("express.router"), ...routerOptions});

      expect(router.raw).toEqual(nativeDriver);
    });
  });
});
