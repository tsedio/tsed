import { Type } from "@tsed/core";
import { InjectorService } from "../../di/services/InjectorService";
import { IInterceptor } from "./interceptor";

/**
 * Attaches interceptor to method call and executes the before and after methods
 * @param interceptors
 */
export function Intercept(interceptor: Type<IInterceptor>): Function {
  return (target: any, method: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (InjectorService.has(interceptor)) {
        const i = InjectorService.get<IInterceptor>(interceptor);

        return i.aroundInvoke({
          target,
          method,
          args,
          proceed: (err?: Error) => {
            if (!err) {
              return original.apply(this, args);
            }

            throw err;
          }
        });
      }

      return original.apply(this, args);
    };

    return descriptor;
  };
}
