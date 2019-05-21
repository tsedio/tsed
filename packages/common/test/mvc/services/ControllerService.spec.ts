import {ProviderType} from "@tsed/di";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {ControllerBuilder, ControllerProvider, ControllerService} from "../../../src/mvc";

class Test {
  constructor(private testService: TestService) {
  }

  test() {
    this.testService.fake();
  }
}

class TestService {
  constructor() {
  }

  fake() {
  }
}

// const pushRouterPath = Sinon.stub();

describe("ControllerService", () => {
  describe("buildRouters()", () => {
    class Test {
    }

    before(() => {
      this.injector = new Map();
      this.injector.set(Test, {
        type: ProviderType.CONTROLLER,
        router: undefined,
        routerOptions: {
          options: "options"
        },
        hasParent() {
          return false;
        }
      });

      this.routerStub = Sinon.stub(Express, "Router");
      this.ctrlBuildStub = Sinon.stub(ControllerBuilder.prototype, "build");

      new ControllerService(
        this.injector,
        {express: "express"} as any,
        {routers: {global: "global"}} as any,
        {routeService: "routeService"} as any
      );
    });

    after(() => {
      this.routerStub.restore();
      this.ctrlBuildStub.restore();
    });

    it("should call ControllerBuilder.build()", () => {
      this.ctrlBuildStub.should.have.been.calledWithExactly(this.injector);
    });
  });
  describe("mapComponents()", () => {
    class Test {
    }

    before(() => {
      this.buildRoutersStub = Sinon.stub(ControllerService.prototype as any, "buildRouters");
      this.mountRouterStub = Sinon.stub(ControllerService.prototype as any, "mountRouter");
      this.provider = {
        type: ProviderType.CONTROLLER,
        hasParent: Sinon.stub(false)
      };
      this.injector = new Map();
      this.injector.set(Test, this.provider);

      this.service = new ControllerService(
        this.injector,
        {express: "express"} as any,
        {routers: {global: "global"}} as any,
        {routeService: "routeService"} as any
      );

      this.service.mapComponents([
        {
          endpoint: "endpoint",
          classes: {
            Test
          }
        }
      ]);
    });

    after(() => {
      this.buildRoutersStub.restore();
      this.mountRouterStub.restore();
    });

    it("should call provider.hasParent()", () => {
      this.provider.hasParent.should.have.been.calledWithExactly();
    });

    it("should call ControllerService.mountRouter()", () => {
      this.mountRouterStub.should.have.been.calledWithExactly("endpoint", this.provider);
    });
  });

  describe("mountRouter()", () => {
    before(() => {
      this.buildRoutersStub = Sinon.stub(ControllerService.prototype as any, "buildRouters");
      this.injector = new Map();

      this.provider = {
        getEndpointUrl: Sinon.stub().returns("/rest/"),
        router: "router"
      };
      this.expressApp = {
        use: Sinon.stub()
      };
      this.routeService = {
        addRoute: Sinon.stub()
      };

      this.service = new ControllerService(
        this.injector,
        this.expressApp as any,
        {routers: {global: "global"}} as any,
        this.routeService as any
      );

      this.service.mountRouter("/", this.provider);
    });

    after(() => {
      this.buildRoutersStub.restore();
    });

    it("should call provider.hasParent()", () => {
      this.provider.getEndpointUrl.should.have.been.calledWithExactly("/");
    });

    it("should call routeService.addRoute()", () => {
      this.routeService.addRoute.should.have.been.calledWithExactly({provider: this.provider, route: "/rest/"});
    });
    it("should call expressApp.use()", () => {
      this.expressApp.use.should.have.been.calledWithExactly("/rest/", "router");
    });
  });

  describe("get()", () => {
    before(() => {
      this.provider = new ControllerProvider(Test);
      ControllerService.set(Test, this.provider);
    });

    it("should return true", () => {
      expect(ControllerService.has(Test)).to.eq(true);
    });
    it("should return provider", () => {
      expect(ControllerService.get(Test)).to.eq(this.provider);
    });
  });

  describe("invoke()", () => {
    describe("when the controller hasn't a configured provider", () => {
      class Test2 {
      }

      before(
        inject([ControllerService], (controllerService: ControllerService) => {
          this.invokeStub = Sinon.stub((controllerService as any).injectorService, "invoke");

          controllerService.invoke(Test2);
        })
      );

      after(() => {
        this.invokeStub.restore();
      });

      it("should call the fake service", () => {
        return this.invokeStub.should.have.been.calledWithExactly(Test2, Sinon.match.any);
      });
    });
  });
});
