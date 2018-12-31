import {InjectorService} from "@tsed/common";
import * as Express from "express";
import {ControllerBuilder} from "../../../src/mvc/class/ControllerBuilder";
import {ControllerProvider} from "../../../src/mvc/class/ControllerProvider";
import {EndpointBuilder} from "../../../src/mvc/class/EndpointBuilder";

import {EndpointRegistry} from "../../../src/mvc/registries/EndpointRegistry";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";

class Test {}

class ChildrenTest {}

describe("ControllerBuilder", () => {
  before(
    inject([InjectorService], (injector: InjectorService) => {
      this.injector = injector;
    })
  );

  describe("without dependencies", () => {
    before(() => {
      this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

      this.controllerProvider = new ControllerProvider(Test);
      this.controllerProvider.path = "/test";

      this.controllerBuilder = new ControllerBuilder(this.controllerProvider);

      EndpointRegistry.use(Test, "test", ["get", "/"]);

      Sinon.stub(this.controllerProvider.router, "use");
      Sinon.stub(this.controllerProvider.router, "get");

      this.controllerBuilder.build(this.injector);
    });
    after(() => {
      this.endpointBuildStub.restore();
    });

    it("should do something", () => {
      expect(!!this.controllerBuilder).to.be.true;
    });

    it("should build controller (get)", () => {
      this.controllerProvider.router.get.calledWith("/");
    });

    it("should call EndpointBuilder.build()", () => {
      expect(this.endpointBuildStub).to.have.been.calledWithExactly(this.injector);
    });
  });

  describe("with dependencies", () => {
    before(
      inject([], () => {
        this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

        this.controllerProvider = new ControllerProvider(Test);
        this.controllerProvider.path = "/test";
        this.controllerProvider.dependencies = [ChildrenTest];
        this.controllerBuilder = new ControllerBuilder(this.controllerProvider);

        EndpointRegistry.use(Test, "test", ["get", "/"]);

        Sinon.stub(this.controllerProvider.router, "use");
        Sinon.stub(this.controllerProvider.router, "get");

        Sinon.stub(this.injector, "getProvider").returns({
          middlewares: {
            useBefore: [],
            useAfter: []
          },
          endpoints: [],
          dependencies: [],
          useClass: ChildrenTest,
          path: "/children"
        });

        this.controllerBuilder.build(this.injector);
      })
    );

    after(() => {
      this.endpointBuildStub.restore();
      this.injector.getProvider.restore();
    });

    it("should do something", () => {
      expect(!!this.controllerBuilder).to.be.true;
    });

    it("should build controller (get)", () => {
      this.controllerProvider.router.get.calledWith("/");
    });

    it("should call EndpointBuilder.build()", () => {
      expect(this.endpointBuildStub).to.have.been.calledWithExactly(this.injector);
    });
  });

  describe("with default options for the router", () => {
    before(() => {
      this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

      this.controllerProvider = new ControllerProvider(Test);
      this.controllerProvider.path = "/test";

      this.expressRouterStub = Sinon.stub(Express, "Router");

      this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"} as any);
    });

    after(() => {
      this.endpointBuildStub.restore();
      this.expressRouterStub.restore();
    });

    it("should be called with the router options", () => {
      this.expressRouterStub.should.be.calledWithExactly({options: "option"});
    });
  });

  describe("with middlewares added on Controller", () => {
    before(() => {
      this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

      this.controllerProvider = new ControllerProvider(Test);
      this.controllerProvider.path = "/test";

      this.mdlw1 = () => {};
      this.mdlw2 = () => {};
      this.mdlw3 = () => {};

      this.controllerProvider.middlewares = {
        useBefore: [this.mdlw1],
        use: [this.mdlw2],
        useAfter: [this.mdlw3]
      };

      this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"} as any);

      Sinon.stub(this.controllerProvider.router, "use");
      Sinon.stub(this.controllerProvider.router, "get");

      EndpointRegistry.use(Test, "test", ["get", "/"]);

      this.controllerBuilder.build({settings: {debug: true}});
    });

    after(() => {
      this.endpointBuildStub.restore();
    });

    it("should add the middlewares to the router", () => {
      this.controllerProvider.router.use.should.be.calledWithExactly(Sinon.match.func);
    });
  });
});
