import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {Platform} from "./Platform";
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
      const platform = await PlatformTest.get<Platform>(Platform);

      jest.spyOn(platform.app, "use");

      // WHEN
      platform.addRoutes([{route: "/test", token: MyCtrl}]);
    });
    it("should add nested controllers", async () => {
      // GIVEN
      const platform = await PlatformTest.get<Platform>(Platform);

      jest.spyOn(platform.app, "use");

      // WHEN
      platform.addRoutes([{route: "/rest", token: MyNestedCtrl}]);
      platform.addRoutes([{route: "/rest", token: MySubCtrl}]);

      platform.getLayers();
      const result = platform.getMountedControllers();

      // THEN
      expect(result.length).toEqual(2);
      expect(result[0].route).toEqual("/rest");
      expect(result[1].route).toEqual("/rest/my-route");
    });
  });
});
