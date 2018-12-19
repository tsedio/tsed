import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {IInterceptor} from "../interfaces/IInterceptor";

/**
 *
 * @param {string} method
 * @param {Type<*>} interceptor
 * @param options
 * @returns {(injector: InjectorService, instance: any) => void}
 */
export function interceptorInvokeFactory(method: string, interceptor: Type<any & IInterceptor>, options?: any) {
  return (injector: InjectorService, target: any) => {
    if (injector.has(interceptor)) {
      const originalMethod = target[method];
      const intcpt = injector.get<IInterceptor>(interceptor)!;

      function interceptedMethod(...args: any[]) {
        const context = {
          target,
          method,
          args,
          proceed(err?: Error) {
            if (!err) {
              return originalMethod.apply(target, args);
            }

            throw err;
          }
        };

        return intcpt.aroundInvoke(context, options);
      }

      target[method] = interceptedMethod;
    }
  };
}
