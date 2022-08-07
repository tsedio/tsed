import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {Platform} from "./Platform";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformRouter} from "./PlatformRouter";
import {PlatformTest} from "./PlatformTest";

@Controller("/my-route")
class MyCtrl {
  @Get("/")
  get() {}
}

@Controller("/my-sub-route")
class MySubCtrl {
  @Get("/")
  get() {}
}

@Controller({
  path: "/my-route",
  children: [MySubCtrl]
})
class MyNestedCtrl {
  @Get("/")
  get() {}
}

describe("Platform", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => jest.resetAllMocks());

  describe("addRoute", () => {
    it("should add a route", async () => {
      // GIVEN
      const provider: ControllerProvider = PlatformTest.injector.getProvider(MyCtrl)! as ControllerProvider;
      const platform = await PlatformTest.get<Platform>(Platform);

      jest.spyOn(platform.app, "use");

      // WHEN
      platform.addRoute("/test", MyCtrl);
      const router = PlatformTest.get<PlatformRouter>(provider.tokenRouter);

      // THEN
      expect(platform.getMountedControllers()).toEqual([{provider, rootPath: "/test", route: "/test/my-route"}]);
      expect(platform.app.use).toBeCalledWith("/test/my-route", router.raw);
    });
    it("should add nested controllers", async () => {
      // GIVEN
      const nestedProvider: ControllerProvider = PlatformTest.injector.getProvider(MyNestedCtrl)! as ControllerProvider;
      const subProvider: ControllerProvider = PlatformTest.injector.getProvider(MySubCtrl)! as ControllerProvider;
      const platform = await PlatformTest.get<Platform>(Platform);

      jest.spyOn(platform.app, "use");

      // WHEN
      platform.addRoute("/test", MyNestedCtrl);
      const router = PlatformTest.get<PlatformRouter>(nestedProvider.tokenRouter);

      // THEN
      expect(platform.getMountedControllers()).toEqual([
        {provider: subProvider, rootPath: "/test/my-route", route: "/test/my-route/my-sub-route"},
        {provider: nestedProvider, rootPath: "/test", route: "/test/my-route"}
      ]);
      expect(platform.app.use).toBeCalledWith("/test/my-route", router.raw);
    });
  });
  describe("getRoutes", () => {
    it("should add a route", async () => {
      // GIVEN
      const driver = {
        use: jest.fn(),
        raw: {
          use: jest.fn()
        }
      };

      const platform = await PlatformTest.invoke<Platform>(Platform, [
        {
          token: PlatformApplication,
          use: driver
        }
      ]);

      // WHEN
      platform.addRoute("/test", MyCtrl);
      platform.addRoute("/test-2", class Test {});

      const result = platform.getRoutes();

      // THEN
      expect(result.map((o) => o.toJSON())).toEqual([
        {
          className: "MyCtrl",
          method: "GET",
          methodClassName: "get",
          name: "MyCtrl.get()",
          parameters: [],
          rawBody: false,
          url: "/test/my-route"
        }
      ]);

      // THEN
      expect(platform.routes.map((o) => o.toJSON())).toEqual([
        {
          className: "MyCtrl",
          method: "GET",
          methodClassName: "get",
          name: "MyCtrl.get()",
          parameters: [],
          rawBody: false,
          url: "/test/my-route"
        }
      ]);
    });
  });
});
