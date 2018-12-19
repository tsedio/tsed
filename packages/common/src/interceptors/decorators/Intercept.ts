import {Store, Type} from "@tsed/core";
import {IInjectableProperties} from "@tsed/di";
import {IInterceptor} from "../interfaces/IInterceptor";
import {interceptorInvokeFactory} from "../utils/interceptorInvokeFactory";

/**
 * Attaches interceptor to method call and executes the before and after methods
 *
 * @param interceptor
 * @param options
 * @decorator
 */
export function Intercept<T extends IInterceptor>(interceptor: Type<T>, options?: any): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Store.from(target).merge("injectableProperties", {
      [propertyKey]: {
        bindingType: "custom",
        propertyKey,
        onInvoke: interceptorInvokeFactory(propertyKey, interceptor, options)
      }
    } as IInjectableProperties);

    return descriptor;
  };
}
