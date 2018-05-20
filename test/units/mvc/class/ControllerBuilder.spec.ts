import {ControllerRegistry} from "@tsed/common";
import * as Express from "express";
import {ControllerBuilder} from "../../../../src/common/mvc/class/ControllerBuilder";
import {ControllerProvider} from "../../../../src/common/mvc/class/ControllerProvider";
import {EndpointBuilder} from "../../../../src/common/mvc/class/EndpointBuilder";

import {EndpointRegistry} from "../../../../src/common/mvc/registries/EndpointRegistry";
import {inject} from "../../../../src/testing/inject";
import {expect, Sinon} from "./../../../tools";

class Test {
}

class ChildrenTest {
}

describe("ControllerBuilder", () => {
  before(() => {
    this.controllerRegistryGetStub = Sinon.stub(ControllerRegistry, "get");
    this.controllerRegistryGetStub.returns(new ControllerProvider(ChildrenTest));
  });

  after(() => {
    this.controllerRegistryGetStub.restore();
  });

  describe("without dependencies", () => {
    before(
      inject([], () => {

        this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

        this.controllerProvider = new ControllerProvider(Test);
        this.controllerProvider.path = "/test";
        this.controllerBuilder = new ControllerBuilder(this.controllerProvider);

        EndpointRegistry.use(Test, "test", ["get", "/"]);

        Sinon.stub(this.controllerProvider.router, "use");
        Sinon.stub(this.controllerProvider.router, "get");

        this.controllerBuilder.build({injector: "injector"});
      })
    );
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
      expect(this.endpointBuildStub).to.have.been.calledWithExactly({injector: "injector"});
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

        this.controllerBuilder.build({injector: "injector"});
      })
    );

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
      expect(this.endpointBuildStub).to.have.been.calledWithExactly({injector: "injector"});
    });
  });

  describe("with default options for the router", () => {
    before(
      inject([], () => {

        this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

        this.controllerProvider = new ControllerProvider(Test);
        this.controllerProvider.path = "/test";

        this.expressRouterStub = Sinon.stub(Express, "Router");

        this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"} as any);
      })
    );

    after(() => {
      this.endpointBuildStub.restore();
      this.expressRouterStub.restore();
    });

    it("should be called with the router options", () => {
      this.expressRouterStub.should.be.calledWithExactly({options: "option"});
    });
  });

  describe("with middlewares added on Controller", () => {
    before(
      inject([], () => {

        this.endpointBuildStub = Sinon.stub(EndpointBuilder.prototype, "build");

        this.controllerProvider = new ControllerProvider(Test);
        this.controllerProvider.path = "/test";

        this.mdlw1 = () => {
        };
        this.mdlw2 = () => {
        };
        this.mdlw3 = () => {
        };

        this.controllerProvider.middlewares = {
          useBefore: [this.mdlw1],
          use: [this.mdlw2],
          useAfter: [this.mdlw3]
        };

        this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"} as any);

        Sinon.stub(this.controllerProvider.router, "use");
        Sinon.stub(this.controllerProvider.router, "get");

        EndpointRegistry.use(Test, "test", ["get", "/"]);

        this.controllerBuilder.build();
      })
    );

    after(() => {
      this.endpointBuildStub.restore();
    });

    it("should add the middlewares to the router", () => {
      this.controllerProvider.router.use.should.be.calledWithExactly(Sinon.match.func);
    });
  });
});
