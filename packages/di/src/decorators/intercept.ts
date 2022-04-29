import {decorateMethodsOf, DecoratorParameters, decoratorTypeOf, DecoratorTypes, Type} from "@tsed/core";
import {InterceptorContext} from "../interfaces/InterceptorContext";
import type {InterceptorMethods} from "../interfaces/InterceptorMethods";
import type {InjectorService} from "../services/InjectorService";

function bindMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor, {options, useType}: any) {
  const originalMethod = (descriptor as PropertyDescriptor).value;

  return {
    ...descriptor,
    value(...args: any[]) {
      const injector = this.$$injector as InjectorService;
      const next = (err?: Error) => {
        if (!err) {
          return originalMethod.apply(this, args);
        }

        throw err;
      };

      const context: InterceptorContext<any> = {
        target,
        propertyKey,
        args,
        options,
        next
      };

      const interceptor = injector.get<InterceptorMethods>(useType)!;

      return interceptor.intercept!(
        {
          ...context,
          options
        },
        next
      );
    }
  };
}

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
        return bindMethod(target, propertyKey as string, descriptor as PropertyDescriptor, {
          options,
          useType: interceptor
        });
    }
  };
}
