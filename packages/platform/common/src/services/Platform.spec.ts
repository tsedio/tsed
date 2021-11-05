import {Controller} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {Platform} from "./Platform";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformTest} from "./PlatformTest";
import {Get} from "@tsed/schema";

const sandbox = Sinon.createSandbox();

@Controller("/my-route")
class MyCtrl {
  @Get("/")
  get() {}
}

describe("Platform", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  describe("addRoute", () => {
    it("should add a route", async () => {
      // GIVEN
      const driver = {
        use: sandbox.stub(),
        raw: {
          use: sandbox.stub()
        }
      };

      const provider = PlatformTest.injector.getProvider(MyCtrl)!;

      const platform = await PlatformTest.invoke<Platform>(Platform, [
        {
          token: PlatformApplication,
          use: driver
        }
      ]);

      // WHEN
      platform.addRoute("/test", MyCtrl);

      // THEN
      expect(platform.getMountedControllers()).to.deep.eq([{provider, route: "/test/my-route"}]);
      expect(driver.use).to.have.been.calledWithExactly("/test/my-route", provider.router.raw);
    });
  });
  describe("getRoutes", () => {
    const sandbox = Sinon.createSandbox();

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
      platform.addRoute("/test-2", class Test {});

      const result = platform.getRoutes();

      // THEN
      expect(result.map((o) => o.toJSON())).to.deep.eq([
        {
          className: "MyCtrl",
          method: "GET",
          methodClassName: "get",
          name: "MyCtrl.get()",
          parameters: [],
          rawBody: false,
          url: "/test/my-route/"
        }
      ]);

      // THEN
      expect(platform.routes.map((o) => o.toJSON())).to.deep.eq([
        {
          className: "MyCtrl",
          method: "GET",
          methodClassName: "get",
          name: "MyCtrl.get()",
          parameters: [],
          rawBody: false,
          url: "/test/my-route/"
        }
      ]);
    });
  });
});
