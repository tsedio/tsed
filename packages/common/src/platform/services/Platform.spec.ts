import {ControllerProvider} from "@tsed/common";
import {GlobalProviders} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {Controller} from "../../mvc";
import {PlatformTest} from "../../platform-test/components/PlatformTest";
import {Platform} from "./Platform";
import {PlatformApplication} from "./PlatformApplication";

const sandbox = Sinon.createSandbox();

describe("Platform", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  describe("addRoute", () => {
    @Controller("/my-route")
    class MyCtrl {}

    after(() => {
      GlobalProviders.delete(MyCtrl);
    });

    it("should add a route", async () => {
      // GIVEN
      const platform = await PlatformTest.invoke<Platform>(Platform);
      const app = PlatformTest.get<PlatformApplication>(PlatformApplication);
      sandbox.spy(app, "use");

      // WHEN
      platform.addRoute("/test", MyCtrl);

      // THEN
      const provider: ControllerProvider = PlatformTest.injector.getProvider(MyCtrl)! as ControllerProvider;
      expect(platform.getMountedControllers()).to.deep.eq([{provider, route: "/test/my-route"}]);
      expect(app.use).to.have.been.calledWithExactly("/test/my-route", provider.getRouter());
    });
  });
  describe("getRoutes", () => {
    const sandbox = Sinon.createSandbox();

    @Controller("/my-route")
    class MyCtrl {}

    after(() => {
      GlobalProviders.delete(MyCtrl);
    });

    it("should add a route", async () => {
      // GIVEN
      const platform = await PlatformTest.invoke<Platform>(Platform);
      const app = PlatformTest.get<PlatformApplication>(PlatformApplication);
      sandbox.spy(app, "use");

      // WHEN
      platform.addRoute("/test", MyCtrl);

      const result = platform.getRoutes();

      // THEN
      expect(result).to.deep.eq([]);

      // THEN
      expect(platform.routes).to.deep.eq([]);
    });
  });
});
