import { Intercept, IInterceptor, InjectorService, IInterceptorContext } from "@tsed/common";
import { Sinon } from "../../../tools";

class TestInterceptor implements IInterceptor {
    aroundInvoke(ctx: IInterceptorContext) {
        console.log('calling interceptor');
        ctx.proceed();
    }
}

class TestService {
    simpleMethod() {
    }
}

describe("Intercept", () => {
    before(() => {
        this.hasStub = Sinon.stub(InjectorService, "has");
        this.getStub = Sinon.stub(InjectorService, "get").returns(TestInterceptor);
        this.interceptorStub = Sinon.stub(TestInterceptor.prototype, "aroundInvoke");
        this.serviceStub = Sinon.stub(TestService.prototype, "simpleMethod");
    });

    after(() => {
        this.hasStub.restore();
        this.getStub.restore();
    });

    it("should call interceptor aroundInvoke", () => {
        const interceptor = Intercept(TestInterceptor);
        const desc = Object.getOwnPropertyDescriptor(TestService.prototype, "simpleMethod");
        interceptor(TestService.prototype, "simpleMethod", desc);
        const serviceInstance = new TestService();

        // invoke the method to see if the interceptor is executed
        serviceInstance.simpleMethod();

        this.hasStub.should.have.been.called();
        // this.hasStub.should.have.been.calledWithExactly(TestInterceptor);
        // this.getStub.should.have.been.calledWithExactly(TestInterceptor);

        this.interceptorStub.shoud.have.been.called();
        // this.interceptorStub.shoud.have.been.calledWith({
        //     target: serviceInstance,
        //     method: "simpleMethod",
        //     args: [],
        //     proceed: Function
        // });

        this.serviceStub.should.have.been.called();
    });
});