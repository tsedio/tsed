import {expect} from "chai";
import {Store} from "@tsed/core";
import {InterceptorMethods, InterceptorContext, InjectablePropertyType, Intercept} from "../../src";
import {INJECTABLE_PROP} from "../constants/constants";

describe("@Intercept", () => {
  it("should add interceptor on method", () => {
    // GIVEN
    class TestInterceptor implements InterceptorMethods {
      intercept(ctx: InterceptorContext<any>) {
        return "";
      }
    }

    // WHEN
    class TestService {
      @Intercept(TestInterceptor, {options: "options"})
      test() {}
    }

    // THEN
    const injectableProperties = Store.from(TestService).get(INJECTABLE_PROP);
    expect(injectableProperties.test.bindingType).to.eq(InjectablePropertyType.INTERCEPTOR);
    expect(injectableProperties.test.useType).to.eq(TestInterceptor);
    expect(injectableProperties.test.options).to.deep.eq({options: "options"});
    expect(injectableProperties.test.propertyKey).to.eq("test");
  });
  it("should add interceptor on class and decorate all methods", () => {
    // GIVEN
    class TestInterceptor implements InterceptorMethods {
      intercept(ctx: InterceptorContext<any>) {
        return "";
      }
    }

    // WHEN
    @Intercept(TestInterceptor, {options: "options"})
    class TestService {
      test2() {}
    }

    // THEN
    const injectableProperties = Store.from(TestService).get(INJECTABLE_PROP);
    expect(injectableProperties.test2.bindingType).to.eq(InjectablePropertyType.INTERCEPTOR);
    expect(injectableProperties.test2.useType).to.eq(TestInterceptor);
    expect(injectableProperties.test2.options).to.deep.eq({options: "options"});
    expect(injectableProperties.test2.propertyKey).to.eq("test2");
  });
});
