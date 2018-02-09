import * as Express from "express";
import * as Proxyquire from "proxyquire";
import {ControllerProvider} from "../../../../src/common/mvc/class/ControllerProvider";
import {EndpointBuilder} from "../../../../src/common/mvc/class/EndpointBuilder";

import {EndpointRegistry} from "../../../../src/common/mvc/registries/EndpointRegistry";
import {inject} from "../../../../src/testing/inject";
import {expect, Sinon} from "./../../../tools";

class Test {
}

class ChildrenTest {
}

const EndpointBuilderStub = Sinon.spy(function () {
    return Sinon.createStubInstance(EndpointBuilder);
});

const ControllerRegistryStub = {
    get: Sinon.stub().returns(new ControllerProvider(ChildrenTest))
};

const {ControllerBuilder} = Proxyquire("../../../../src/common/mvc/class/ControllerBuilder", {
    "./EndpointBuilder": {EndpointBuilder: EndpointBuilderStub},
    "../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
});

describe("ControllerBuilder", () => {

    describe("without dependencies", () => {
        before(inject([], () => {
            this.controllerProvider = new ControllerProvider(Test);
            this.controllerProvider.path = "/test";
            this.controllerBuilder = new ControllerBuilder(this.controllerProvider);

            EndpointRegistry.use(Test, "test", ["get", "/"]);

            Sinon.stub(this.controllerProvider.router, "use");
            Sinon.stub(this.controllerProvider.router, "get");

            this.controllerBuilder.build();
        }));

        it("should do something", () => {
            expect(!!this.controllerBuilder).to.be.true;
        });

        it("should build controller (get)", () => {
            this.controllerProvider.router.get.calledWith("/");
        });

        it("should create new EndpointBuilder", () => {
            expect(EndpointBuilderStub).to.have.been.calledWithNew;
        });

    });

    describe("with dependencies", () => {
        before(inject([], () => {
            this.controllerProvider = new ControllerProvider(Test);
            this.controllerProvider.path = "/test";
            this.controllerProvider.dependencies = [ChildrenTest];
            this.controllerBuilder = new ControllerBuilder(this.controllerProvider);

            EndpointRegistry.use(Test, "test", ["get", "/"]);

            Sinon.stub(this.controllerProvider.router, "use");
            Sinon.stub(this.controllerProvider.router, "get");

            this.controllerBuilder.build();
        }));

        it("should do something", () => {
            expect(!!this.controllerBuilder).to.be.true;
        });

        it("should build controller (get)", () => {
            this.controllerProvider.router.get.calledWith("/");
        });

        it("should create new EndpointBuilder", () => {
            expect(EndpointBuilderStub).to.have.been.calledWithNew;
        });

    });

    describe("with default options for the router", () => {
        before(inject([], () => {
            this.controllerProvider = new ControllerProvider(Test);
            this.controllerProvider.path = "/test";

            this.expressRouterStub = Sinon.stub(Express, "Router");

            this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"});
        }));

        after(() => {
            this.expressRouterStub.restore();
        });

        it("should be called with the router options", () => {
            this.expressRouterStub.should.be.calledWithExactly({options: "option"});
        });

    });

    describe("with middlewares added on Controller", () => {
        before(inject([], () => {
            this.controllerProvider = new ControllerProvider(Test);
            this.controllerProvider.path = "/test";

            this.mdlw1 = function () {
            };
            this.mdlw2 = function () {
            };
            this.mdlw3 = function () {
            };

            this.controllerProvider.middlewares = {
                useBefore: [this.mdlw1],
                use: [this.mdlw2],
                useAfter: [this.mdlw3]
            };

            this.controllerBuilder = new ControllerBuilder(this.controllerProvider, {options: "option"});

            Sinon.stub(this.controllerProvider.router, "use");
            Sinon.stub(this.controllerProvider.router, "get");

            EndpointRegistry.use(Test, "test", ["get", "/"]);

            this.controllerBuilder.build();
        }));

        it("should add the middlewares to the router", () => {
            this.controllerProvider.router.use.should.be.calledWithExactly(Sinon.match.func);
        });
    });
});