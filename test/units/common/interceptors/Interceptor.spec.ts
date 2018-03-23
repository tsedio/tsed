import { Intercept, IInterceptor, InjectorService, IInterceptorContext, Interceptor } from "@tsed/common";
import { Sinon, expect } from "../../../tools";

describe("@Interceptor", () => {
    class ServiceTest implements IInterceptor { aroundInvoke() { } }

    before(() => {
        this.serviceStub = Sinon.stub(InjectorService, 'service');
    });

    after(() => {
        this.serviceStub.restore();
    });

    it('should register an interceptor class as a service', () => {
        const returned = Interceptor()(ServiceTest);
        this.serviceStub.should.have.been.calledWithExactly(ServiceTest);
        expect(returned).to.equal(ServiceTest);
    });
});
