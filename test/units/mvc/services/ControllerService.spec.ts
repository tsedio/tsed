import * as Proxyquire from "proxyquire";
import {InjectorService} from "../../../../src/di/services/InjectorService";
import {ControllerProvider} from "../../../../src/mvc/class/ControllerProvider";
import {ProxyControllerRegistry} from "../../../../src/mvc/registries/ControllerRegistry";
import {ControllerService} from "../../../../src/mvc/services/ControllerService";
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

const ControllerRegistry = {
    get: Sinon.stub().returns({pushRouterPath, provide: Test, useClass: Test}),
    has: Sinon.stub().returns(true),
    forEach: Sinon.stub()
};

const ControllerServiceProxy = Proxyquire.load("../../../../src/mvc/services/ControllerService", {
    "../registries/ControllerRegistry": {
        ControllerRegistry,
        ProxyControllerRegistry
    }
}).ControllerService;


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

    /*describe("require()", () => {
     before(() => {
     this.conf = ControllerServiceProxy.require("./test");
     this.conf.mapTo("/");
     });

     it("should returns object", () => {
     expect(this.conf).to.be.an("object");
     });

     it("should returns an object with classes", () => {
     expect(this.conf.classes).to.be.an("array");
     });

     it("should returns an object with mapTo function", () => {
     expect(this.conf.mapTo).to.be.a("function");
     });

     it("should have been called the pushRouterPath method", () => {
     expect(pushRouterPath.should.calledWithExactly("/"));
     });
     });*/

    describe("buildControllers()", () => {
        before(() => {
            this.expressApplicationStub = {use: Sinon.stub()};
            this.controllerProvider = new ControllerProvider(Test);
            this.controllerProvider.pushRouterPath("/rest");
            this.controllerProvider.path = "test";

            this.controllerService = new ControllerServiceProxy(InjectorService, this.expressApplicationStub, {routers: {}});
            this.controllerService.buildControllers();

            ControllerRegistry.forEach.callArgWith(0, this.controllerProvider);
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