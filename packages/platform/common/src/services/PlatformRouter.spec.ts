import {InjectorService, PLATFORM_ROUTER_OPTIONS} from "@tsed/common";
import {PlatformRouter} from "./PlatformRouter";

describe("PlatformRouter", () => {
  describe("create()", () => {
    it("should create a new router", async () => {
      // GIVEN
      const injector = new InjectorService();
      jest.spyOn(injector, "invoke").mockReturnValue(undefined);
      const routerOptions: any = {
        test: "options"
      };

      // WHEN
      PlatformRouter.create(injector, routerOptions);

      // THEN
      const locals = new Map();
      locals.set(PLATFORM_ROUTER_OPTIONS, routerOptions);
      expect(injector.invoke).toBeCalledWith(PlatformRouter, locals);
    });
  });
});
