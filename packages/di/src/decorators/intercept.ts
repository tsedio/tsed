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
    const type = decoratorTypeOf(args);
    console.log("===", args);
    switch (type) {
      case DecoratorTypes.CLASS:
        console.log("===");
        decorateMethodsOf(args[0], Intercept(interceptor, options));
        break;
      case DecoratorTypes.METHOD:
        Store.from(args[0]).merge(INJECTABLE_PROP, {
          [args[1]]: {
            bindingType: InjectablePropertyType.INTERCEPTOR,
            propertyKey: args[1],
            useType: interceptor,
            options
          }
        } as InjectableProperties);

        return args[2] as any;
    }
  };
}
