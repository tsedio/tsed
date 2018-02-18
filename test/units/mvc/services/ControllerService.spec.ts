import {InjectorService} from "../../../../src/common/di/services/InjectorService";
import {ControllerProvider} from "../../../../src/common/mvc/class/ControllerProvider";
import {ControllerRegistry} from "../../../../src/common/mvc/registries/ControllerRegistry";
import {ControllerService} from "../../../../src/common/mvc/services/ControllerService";
import {inject} from "../../../../src/testing/inject";
import {expect, Sinon} from "../../../tools";


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

const pushRouterPath = Sinon.stub();

describe("ControllerService", () => {

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

    describe("buildControllers()", () => {
        before(() => {
            this.getStub = Sinon.stub(ControllerRegistry, "get");
            this.hasStub = Sinon.stub(ControllerRegistry, "has");
            this.forEachStub = Sinon.stub(ControllerRegistry, "forEach");
        });

        after(() => {
            this.getStub.restore();
            this.hasStub.restore();
            this.forEachStub.restore();
        });
        describe("when the controller is not scoped", () => {
            before(() => {
                this.expressApplicationStub = {use: Sinon.stub()};
                this.controllerProvider = new ControllerProvider(Test);
                this.controllerProvider.pushRouterPath("/rest");
                this.controllerProvider.path = "test";
                this.controllerProvider.scope = false;

                this.controllerService = new ControllerService(InjectorService as any, this.expressApplicationStub, {routers: {}} as any);

                this.invokeStub = Sinon.stub(this.controllerService, "invoke");
                this.invokeStub.returns({instance: "instance"});
                this.controllerService.buildControllers();

                this.forEachStub.callArgWith(0, this.controllerProvider);
            });

            after(() => {
                this.invokeStub.restore();
            });

            it("should called forEach()", () => {
                ControllerRegistry.forEach.should.have.been.called;
            });

            it("should called use()", () => {
                this.expressApplicationStub.use.should.have.been.called;
            });

            it("should append routerController to expressApplication", () => {
                this.expressApplicationStub.use.calledWithExactly("/rest/test", Sinon.match.func);
            });

            it("should built the controller", () => {
                return this.invokeStub.should.be.calledOnce.and.calledWithExactly(this.controllerProvider.useClass);
            });

            it("should store the instance", () => {
                this.controllerProvider.instance.should.deep.eq({instance: "instance"});
            });
        });

        describe("when the controller is scoped", () => {
            before(() => {
                this.expressApplicationStub = {use: Sinon.stub()};
                this.controllerProvider = new ControllerProvider(Test);
                this.controllerProvider.pushRouterPath("/rest");
                this.controllerProvider.path = "test";
                this.controllerProvider.scope = "request";

                this.controllerService = new ControllerService(InjectorService as any, this.expressApplicationStub, {routers: {}} as any);

                this.invokeStub = Sinon.stub(this.controllerService, "invoke");
                this.controllerService.buildControllers();

                this.forEachStub.callArgWith(0, this.controllerProvider);
            });

            after(() => {
                this.invokeStub.restore();
            });

            it("should called forEach()", () => {
                ControllerRegistry.forEach.should.have.been.called;
            });

            it("should called use()", () => {
                this.expressApplicationStub.use.should.have.been.called;
            });

            it("should append routerController to expressApplication", () => {
                this.expressApplicationStub.use.calledWithExactly("/rest/test", Sinon.match.func);
            });

            it("should not built the controller", () => {
                return this.invokeStub.should.not.be.called;
            });
        });

    });

    describe("invoke()", () => {
        before(inject([ControllerService], (controllerService: ControllerService) => {
            this.locals = new Map();
            this.fakeService = {fake: Sinon.stub()};
            this.locals.set(TestService, this.fakeService);

            this.controller = controllerService.invoke(Test, this.locals, [TestService]);
            this.controller.test();
        }));

        it("should call the fake service", () =>
            this.fakeService.fake.should.have.been.called
        );
    });
});