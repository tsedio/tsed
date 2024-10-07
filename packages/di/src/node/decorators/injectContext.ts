import {catchError} from "@tsed/core";

import {DIContext} from "../domain/DIContext.js";
import {context} from "../fn/context.js";

/**
 * Inject a context like PlatformContext or any BaseContext.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @InjectContext()
 *   ctx?: Context;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function InjectContext(transform: ($ctx: DIContext) => unknown = (o) => o): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    catchError(() => Reflect.deleteProperty(target, propertyKey));
    Reflect.defineProperty(target, propertyKey, {
      get() {
        return transform(context());
      }
    });
  };
}
