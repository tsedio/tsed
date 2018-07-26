import {Intercept} from "@tsed/common";
import {Store} from "@tsed/core";
import * as mod from "../../../../packages/common/src/interceptors/utils/interceptorInvokeFactory";
import {expect, Sinon} from "../../../tools";

describe("@Intercept", () => {
  class TestService {}

  before(() => {
    this.interceptor = {
      aroundInvoke: Sinon.stub()
    };
    this.interceptorInvokeFactory = Sinon.stub(mod, "interceptorInvokeFactory").returns("fn");

    Intercept(this.interceptor, {options: "options"})(TestService, "test", {});

    this.injectableProperties = Store.from(TestService).get("injectableProperties");
  });

  after(() => {
    this.interceptorInvokeFactory.restore();
  });

  it("should store metadata", () => {
    expect(this.injectableProperties).to.deep.eq({
      test: {
        bindingType: "custom",
        propertyKey: "test",
        onInvoke: "fn"
      }
    });
  });

  it("should call interceptorInvokeFactory()", () => {
    this.interceptorInvokeFactory.should.have.been.calledWithExactly("test", this.interceptor, {options: "options"});
  });
});
