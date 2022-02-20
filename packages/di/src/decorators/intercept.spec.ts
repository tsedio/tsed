import {expect} from "chai";
import {Store} from "@tsed/core";
import {InterceptorMethods, InterceptorContext, InjectablePropertyType, Intercept} from "../../src";
import {INJECTABLE_PROP} from "../constants/constants";

describe("@Intercept", () => {
  it("should store metadata", () => {
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
});
