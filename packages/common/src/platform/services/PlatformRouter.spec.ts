import {InjectorService, PLATFORM_ROUTER_OPTIONS} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {PlatformRouter} from "./PlatformRouter";

describe("PlatformRouter", () => {
  describe("create()", () => {
    it("should create a new router", async () => {
      // GIVEN
      const injector = new InjectorService();
      Sinon.stub(injector, "invoke");
      const routerOptions: any = {
        test: "options"
      };

      // WHEN
      PlatformRouter.create(injector, routerOptions);

      // THEN
      const locals = new Map();
      locals.set(PLATFORM_ROUTER_OPTIONS, routerOptions);
      expect(injector.invoke).to.have.been.calledWith(PlatformRouter, locals);
    });
  });
});
