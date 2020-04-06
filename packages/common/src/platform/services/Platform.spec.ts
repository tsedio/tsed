import {GlobalProviders, InjectorService} from "@tsed/di";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Controller} from "../../mvc";
import {Platform} from "./Platform";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformRouter} from "./PlatformRouter";

const sandbox = Sinon.createSandbox();

describe("Platform", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);
  afterEach(() => sandbox.restore());
  describe("createRouter", () => {
    it(
      "should create a router",
      TestContext.inject([InjectorService, Platform], async (injector: InjectorService, platform: Platform) => {
        const givenRouter = {
          use: sandbox.stub()
        };

        injector.addProvider(PlatformRouter, {
          useFactory() {
            return givenRouter;
          }
        });

        sandbox.spy(injector, "invoke");
        // WHEN
        const router = platform.createRouter({options: "options"});

        // THEN
        injector.invoke.should.have.been.calledWithExactly(PlatformRouter, Sinon.match.any);
        expect(router).to.deep.eq(givenRouter);
      })
    );
  });
  describe("addRoute", () => {
    @Controller("/my-route")
    class MyCtrl {}

    after(() => {
      GlobalProviders.delete(MyCtrl);
    });

    it(
      "should add a route",
      TestContext.inject([InjectorService], async (injector: InjectorService) => {
        // GIVEN
        const driver = {
          use: sandbox.stub(),
          raw: {
            use: sandbox.stub()
          }
        };

        const platform = await TestContext.invoke<Platform>(Platform, [
          {
            provide: PlatformApplication,
            use: driver
          }
        ]);

        // WHEN
        platform.addRoute("/test", MyCtrl);

        // THEN
        const provider = injector.getProvider(MyCtrl)!;
        platform.routes.should.deep.eq([{provider, route: "/test/my-route"}]);
        driver.use.should.have.been.calledWithExactly("/test/my-route", provider.router.raw);
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

      const platform = await TestContext.invoke<Platform>(Platform, [
        {
          provide: PlatformApplication,
          use: driver
        }
      ]);

      // WHEN
      platform.addRoute("/test", MyCtrl);

      const result = platform.getRoutes();

      // THEN
      result.should.deep.eq([]);
    });
  });
});
