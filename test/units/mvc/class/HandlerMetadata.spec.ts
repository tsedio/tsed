import {expect, Sinon} from "../../../tools";
import * as Proxyquire from "proxyquire";
import {MiddlewareType} from "../../../../src/mvc/interfaces/Middleware";

const ParamsRegistry = {
    isInjectable: Sinon.stub(),
    hasNextFunction: Sinon.stub(),
    getParams: Sinon.stub().returns([])
};

const MiddlewareRegistry = {
    has: Sinon.stub(),
    get: Sinon.stub()
};

const ControllerRegistry = {
    has: Sinon.stub()
};

const HandlerMetadata = Proxyquire("../../../../src/mvc/class/HandlerMetadata", {
    "../registries/ParamsRegistry": {ParamsRegistry},
    "../registries/MiddlewareRegistry": {MiddlewareRegistry},
    "../registries/ControllerRegistry": {ControllerRegistry}
}).HandlerMetadata;

class Test {
    use(req, res, next) {

    }

    test(req, res, next) {
    }
}
class Test2 {
    use(err, req, res, next) {

    }
}

describe("HandlerMetadata", () => {
    describe("from function", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(false);
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata((req, res, next) => {
            });
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("function");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq(undefined);
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });
    });

    describe("from function err", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(false);
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata((err, req, res, next) => {
            });
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("function");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq(undefined);
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("should have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(true);
        });
    });

    describe("from function with nextFn", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(false);
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata((req, res) => {
            });
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("function");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq(undefined);
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(false);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });
    });

    describe("from endpoint without injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(false);
            ControllerRegistry.has.returns(true);

            this.handlerMetadata = new HandlerMetadata(Test, "test");
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("controller");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("test");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });
    });

    describe("from endpoint with injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(true);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(false);
            ControllerRegistry.has.returns(true);

            this.handlerMetadata = new HandlerMetadata(Test, "test");
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            ControllerRegistry.has.reset();
        });

        it("should be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(true);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("controller");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("test");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });
    });

    describe("from middleware with injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(true);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(true);
            MiddlewareRegistry.get.returns({type: MiddlewareType.MIDDLEWARE});
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata(Test);
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            MiddlewareRegistry.get.reset();
            ControllerRegistry.has.reset();
        });

        it("should be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(true);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("middleware");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("use");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });

        it("should return target", () => {
            expect(this.handlerMetadata.target).to.eq(Test);
        });

        it("should return services", () => {
            expect(this.handlerMetadata.services).to.be.an("array");
        });
    });

    describe("from middleware without injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(false);
            MiddlewareRegistry.has.returns(true);
            MiddlewareRegistry.get.returns({type: MiddlewareType.MIDDLEWARE});
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata(Test);
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            MiddlewareRegistry.get.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("middleware");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("use");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("shouldn't have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(false);
        });

        it("should return target", () => {
            expect(this.handlerMetadata.target).to.eq(Test);
        });

        it("should return services", () => {
            expect(this.handlerMetadata.services).to.be.an("array");
        });
    });

    describe("from middlewareError with injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(true);
            ParamsRegistry.hasNextFunction.returns(true);
            MiddlewareRegistry.has.returns(true);
            MiddlewareRegistry.get.returns({type: MiddlewareType.ERROR});
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata(Test);
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            MiddlewareRegistry.get.reset();
            ControllerRegistry.has.reset();
        });

        it("should be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(true);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("middleware");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("use");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("should have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(true);
        });

        it("should return target", () => {
            expect(this.handlerMetadata.target).to.eq(Test);
        });

        it("should return services", () => {
            expect(this.handlerMetadata.services).to.be.an("array");
        });
    });
    describe("from middlewareError without injection", () => {
        before(() => {
            ParamsRegistry.isInjectable.returns(false);
            ParamsRegistry.hasNextFunction.returns(false);
            MiddlewareRegistry.has.returns(true);
            MiddlewareRegistry.get.returns({type: MiddlewareType.ERROR});
            ControllerRegistry.has.returns(false);

            this.handlerMetadata = new HandlerMetadata(Test2);
        });

        after(() => {
            ParamsRegistry.isInjectable.reset();
            ParamsRegistry.hasNextFunction.reset();
            MiddlewareRegistry.has.reset();
            MiddlewareRegistry.get.reset();
            ControllerRegistry.has.reset();
        });

        it("shouldn't be injectable", () => {
            expect(this.handlerMetadata.injectable).to.eq(false);
        });

        it("should return controller type", () => {
            expect(this.handlerMetadata.type).to.eq("middleware");
        });

        it("should have a class method", () => {
            expect(this.handlerMetadata.methodClassName).to.eq("use");
        });

        it("should have a next Function", () => {
            expect(this.handlerMetadata.nextFunction).to.eq(true);
        });

        it("should have a err param", () => {
            expect(this.handlerMetadata.errorParam).to.eq(true);
        });

        it("should return target", () => {
            expect(this.handlerMetadata.target).to.eq(Test2);
        });

        it("should return services", () => {
            expect(this.handlerMetadata.services).to.be.an("array");
        });
    });

});