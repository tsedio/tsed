import {IInterceptor} from "@tsed/common";
import {interceptorInvokeFactory} from "../../../../src/common/interceptors/utils/interceptorInvokeFactory";
import {expect, Sinon} from "../../../tools";

describe("interceptorInvokeFactory()", () => {
  describe("when success", () => {
    class InterceptorTest implements IInterceptor {
      aroundInvoke() {}
    }

    before(() => {
      this.interceptor = {
        aroundInvoke: Sinon.stub()
      };

      this.injector = {
        has: Sinon.stub().returns(true),
        get: Sinon.stub().returns(this.interceptor)
      };

      this.originalMethod = Sinon.stub();
      this.instance = {
        test: this.originalMethod
      };

      interceptorInvokeFactory("test", InterceptorTest, {options: "options"})(this.injector, this.instance);

      this.instance.test("arg1", "arg2");

      this.interceptor.aroundInvoke.getCall(0).args[0].proceed();
    });

    it("should call injector.has()", () => {
      this.injector.has.should.have.been.calledWithExactly(InterceptorTest);
    });

    it("should get the instance interceptor", () => {
      this.injector.get.should.have.been.calledWithExactly(InterceptorTest);
    });

    it("should call the aroundInvoke() method", () => {
      this.interceptor.aroundInvoke.should.have.been.calledWithExactly(
        {
          target: this.instance,
          method: "test",
          args: ["arg1", "arg2"],
          proceed: Sinon.match.func
        },
        {options: "options"}
      );
    });

    it("should call the original method", () => {
      this.originalMethod.should.have.been.calledWithExactly("arg1", "arg2");
    });
  });
  describe("when error", () => {
    class InterceptorTest implements IInterceptor {
      aroundInvoke() {}
    }

    before(() => {
      this.interceptor = {
        aroundInvoke: Sinon.stub()
      };

      this.injector = {
        has: Sinon.stub().returns(true),
        get: Sinon.stub().returns(this.interceptor)
      };

      this.originalMethod = Sinon.stub();
      this.instance = {
        test: this.originalMethod
      };

      interceptorInvokeFactory("test", InterceptorTest, {options: "options"})(this.injector, this.instance);

      this.instance.test("arg1", "arg2");

      try {
        this.interceptor.aroundInvoke.getCall(0).args[0].proceed(new Error("message"));
      } catch (er) {
        this.error = er;
      }
    });

    it("should call injector.has()", () => {
      this.injector.has.should.have.been.calledWithExactly(InterceptorTest);
    });

    it("should get the instance interceptor", () => {
      this.injector.get.should.have.been.calledWithExactly(InterceptorTest);
    });

    it("should call the aroundInvoke() method", () => {
      this.interceptor.aroundInvoke.should.have.been.calledWithExactly(
        {
          target: this.instance,
          method: "test",
          args: ["arg1", "arg2"],
          proceed: Sinon.match.func
        },
        {options: "options"}
      );
    });

    it("should call the original method", () => {
      this.originalMethod.should.not.have.been.called;
    });

    it("should throw error", () => {
      expect(this.error.message).to.eq("message");
    });
  });
});
