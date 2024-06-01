import {injectProperty} from "../../common/index.js";
import {getContext} from "../utils/asyncHookContext.js";

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
export function InjectContext(): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    injectProperty(target, propertyKey, {
      resolver() {
        return () => getContext();
      }
    });
  };
}
