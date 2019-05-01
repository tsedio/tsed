import {Store} from "@tsed/core";
import {expect} from "chai";
import {IInterceptor, IInterceptorContext, InjectablePropertyType, Intercept} from "../../src";

describe("@Intercept", () => {
  class TestInterceptor implements IInterceptor {
    aroundInvoke(ctx: IInterceptorContext<any>, options?: any) {

      return "";
    }
  }

  it("should store metadata", () => {
    // WHEN
    class TestService {
      @Intercept(TestInterceptor, {options: "options"})
      test() {
      }
    }

    // THEN
    const injectableProperties = Store.from(TestService).get("injectableProperties");
    injectableProperties.test.bindingType.should.eq(InjectablePropertyType.INTERCEPTOR);
    injectableProperties.test.useType.should.eq(TestInterceptor);
    injectableProperties.test.options.should.deep.eq({options: "options"});
    injectableProperties.test.propertyKey.should.eq("test");
  });
});
