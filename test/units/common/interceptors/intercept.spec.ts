import {IInterceptor, InjectorService, Intercept} from "@tsed/common";
import {Sinon} from "../../../tools";

describe("@Intercept", () => {
  class ServiceTest {}

  class InterceptorTest implements IInterceptor {
    aroundInvoke() {}
  }

  before(() => {
    this.interceptor = {
      aroundInvoke: Sinon.stub()
    };

    this.originalMethod = Sinon.stub();

    this.descriptor = {
      value: this.originalMethod
    };

    this.hasStub = Sinon.stub(InjectorService, "has").returns(true);
    this.getStub = Sinon.stub(InjectorService, "get").returns(this.interceptor);

    this.serviceInstance = new ServiceTest();
    this.returnedDescriptor = Intercept(InterceptorTest, {options: "options"} as any)(this.serviceInstance, "method", this.descriptor);
  });

  after(() => {
    this.hasStub.restore();
    this.getStub.restore();
  });

  it("should call InjectorService.has", () => {
    this.returnedDescriptor.value("arg1");
    this.interceptor.aroundInvoke.getCall(0).args[0].proceed();
    this.hasStub.should.have.been.calledWithExactly(InterceptorTest);
  });

  it("should call InjectorService.get", () => {
    this.returnedDescriptor.value("arg1");
    this.interceptor.aroundInvoke.getCall(0).args[0].proceed();

    this.getStub.should.have.been.calledWithExactly(InterceptorTest);
  });

  it("should call interceptor.aroundInvoke", () => {
    this.returnedDescriptor.value("arg1");
    this.interceptor.aroundInvoke.getCall(0).args[0].proceed();

    this.interceptor.aroundInvoke.should.have.been.calledWithExactly(
      {
        target: Sinon.match.any,
        method: "method",
        args: ["arg1"],
        proceed: Sinon.match.func
      },
      {options: "options"}
    );
  });

  it("should call the original method", () => {
    this.returnedDescriptor.value("arg1");
    this.interceptor.aroundInvoke.getCall(0).args[0].proceed();
    this.originalMethod.should.have.been.calledWithExactly("arg1");
  });

  it("should call the original method if no interceptors", () => {
    this.hasStub.restore();
    this.hasStub = Sinon.stub(InjectorService, "has").returns(false);
    this.returnedDescriptor.value("arg1");
    this.interceptor.aroundInvoke.getCall(0).args[0].proceed();
    this.originalMethod.should.have.been.calledWithExactly("arg1");
  });

  it("should throw error through the original method if one is passed to proceed", () => {
    try {
      this.returnedDescriptor.value("arg1");
      this.interceptor.aroundInvoke.getCall(0).args[0].proceed(new Error("simple error"));
    } catch (err) {
      this.originalMethod.throws(Error, "simple error");
    }
  });
});
