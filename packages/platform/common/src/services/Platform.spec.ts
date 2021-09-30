import {GlobalProviders, InjectorService, Controller} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {Platform} from "./Platform";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformTest} from "./PlatformTest";

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

    it(
      "should add a route",
      PlatformTest.inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        const driver = {
          use: sandbox.stub(),
          raw: {
            use: sandbox.stub()
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

        // THEN
        const provider = injector.getProvider(MyCtrl)!;
        expect(platform.getMountedControllers()).to.deep.eq([{provider, route: "/test/my-route"}]);
        expect(driver.use).to.have.been.calledWithExactly("/test/my-route", provider.router.raw);
      })
    );
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
      const driver = {
        use: sandbox.stub(),
        raw: {
          use: sandbox.stub()
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

      const result = platform.getRoutes();

      // THEN
      expect(result).to.deep.eq([]);

      // THEN
      expect(platform.routes).to.deep.eq([]);
    });
  });
});
