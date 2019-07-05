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
