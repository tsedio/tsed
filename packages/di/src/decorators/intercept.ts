import {decorateMethodsOf, DecoratorParameters, decoratorTypeOf, DecoratorTypes, Store, Type} from "@tsed/core";
import {INJECTABLE_PROP} from "../constants/constants";
import {InjectablePropertyType} from "../domain/InjectablePropertyType";
import type {InterceptorMethods} from "../interfaces/InterceptorMethods";
import type {InjectableProperties} from "../interfaces/InjectableProperties";

/**
 * Attaches interceptor to method call and executes the before and after methods
 *
 * @param interceptor
 * @param options
 * @decorator
 */
export function Intercept<T extends InterceptorMethods>(interceptor: Type<T>, options?: any): any {
  return (...args: DecoratorParameters) => {
    const [target, propertyKey, descriptor] = args;
    const type = decoratorTypeOf(args);
    switch (type) {
      case DecoratorTypes.CLASS:
        decorateMethodsOf(target, Intercept(interceptor, options));
        break;
      case DecoratorTypes.METHOD:
        Store.from(target).merge(INJECTABLE_PROP, {
          [propertyKey]: {
            options,
            propertyKey,
            useType: interceptor,
            bindingType: InjectablePropertyType.INTERCEPTOR
          }
        } as InjectableProperties);

        return descriptor;
    }
  };
}
