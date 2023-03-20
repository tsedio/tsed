import {Store} from "@tsed/core";
import {INJECTABLE_PROP} from "../constants/constants";
import {InjectablePropertyType} from "../domain/InjectablePropertyType";
import {InterceptorContext} from "../interfaces/InterceptorContext";
import {InterceptorMethods} from "../interfaces/InterceptorMethods";
import {Intercept} from "./intercept";

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
    expect(injectableProperties.test.bindingType).toEqual(InjectablePropertyType.INTERCEPTOR);
    expect(injectableProperties.test.useType).toEqual(TestInterceptor);
    expect(injectableProperties.test.options).toEqual({options: "options"});
    expect(injectableProperties.test.propertyKey).toEqual("test");
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
    expect(injectableProperties.test2.bindingType).toEqual(InjectablePropertyType.INTERCEPTOR);
    expect(injectableProperties.test2.useType).toEqual(TestInterceptor);
    expect(injectableProperties.test2.options).toEqual({options: "options"});
    expect(injectableProperties.test2.propertyKey).toEqual("test2");
  });
});
