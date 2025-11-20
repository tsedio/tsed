import {catchError} from "@tsed/core/utils/catchError.js";
import {isFunction} from "@tsed/core/utils/isFunction.js";

import {lazyInject, optionalLazyInject} from "../fn/lazyInject.js";

function mapOptions(args: any[], optional = false) {
  function wrap(key: string, resolver: any) {
    return async () => {
      try {
        const {[key]: token} = await resolver();

        return {default: token};
      } catch (er) {
        if (!optional) {
          throw er;
        }

        return;
      }
    };
  }

  if (isFunction(args[0])) {
    return wrap("default", args[0]);
  }

  return wrap(args[0], args[1]);
}

/**
 * Lazily inject a provider from a dynamic import.
 *
 * Defers loading and injection of a provider until the property is first accessed.
 * Useful for code splitting, optional dependencies, or reducing initial bundle size.
 *
 * ### Usage
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 * import {Injectable, LazyInject} from "@tsed/di";
 *
 * @Injectable()
 * export class MyService {
 *   // Import default export
 *   @LazyInject(() => import("@tsed/platform-exceptions"))
 *   exceptions: Promise<PlatformException>;
 *
 *   // Import named export
 *   @LazyInject("MyPlugin", () => import("./plugins"))
 *   plugin: Promise<MyPlugin>;
 *
 *   async handleError(error: Error) {
 *     const handler = await this.exceptions;
 *     handler.handle(error);
 *   }
 * }
 * ```
 *
 * @param key Optional named export to extract from the module
 * @param resolver Function returning a promise resolving to the module
 * @returns Property decorator function
 * @public
 * @decorator
 */
export function LazyInject(resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function LazyInject(key: string, resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function LazyInject(...args: any[]): PropertyDecorator {
  let resolver = mapOptions(args);

  return (target: any, propertyKey: string | symbol): any | void => {
    catchError(() => Reflect.deleteProperty(target, propertyKey));
    Reflect.defineProperty(target, propertyKey, {
      async get() {
        return lazyInject<any>(resolver as any);
      }
    });
  };
}

/**
 * Optionally inject a provider from a dynamic import, returning undefined on failure.
 *
 * Similar to `@LazyInject` but gracefully handles import failures by returning undefined.
 * Useful for truly optional dependencies that may not be available in all environments.
 *
 * ### Usage
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 * import {Injectable, OptionalLazyInject} from "@tsed/di";
 *
 * @Injectable()
 * export class MyService {
 *   @OptionalLazyInject(() => import("@tsed/platform-exceptions"))
 *   exceptions?: Promise<PlatformException>;
 *
 *   async handleError(error: Error) {
 *     const handler = await this.exceptions;
 *     if (handler) {
 *       handler.handle(error);
 *     } else {
 *       console.error("Exception handler not available:", error);
 *     }
 *   }
 * }
 * ```
 *
 * @param key Optional named export to extract from the module
 * @param resolver Function returning a promise resolving to the module
 * @returns Property decorator function
 * @public
 */
export function OptionalLazyInject(resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function OptionalLazyInject(key: string, resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function OptionalLazyInject(...args: any[]): PropertyDecorator {
  const resolver = mapOptions(args, true);

  return (target: any, propertyKey: string | symbol): any | void => {
    catchError(() => Reflect.deleteProperty(target, propertyKey));
    Reflect.defineProperty(target, propertyKey, {
      async get() {
        return optionalLazyInject(resolver as any);
      }
    });
  };
}
