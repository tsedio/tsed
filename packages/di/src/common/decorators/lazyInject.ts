import {catchError, isFunction} from "@tsed/core";

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
 * Lazy load a provider from his package and invoke only when the provider is used
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 *
 * @Injectable()
 * export class MyService {
 *   @LazyInject(() => import("@tsed/platform-exceptions"))
 *   exceptions: Promise<PlatformException>;
 * }
 * ```
 *s
 * @returns {Function}
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
 * Optionally Lazy load a provider from his package and invoke only when the provider is used
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 *
 * @Injectable()
 * export class MyService {
 *   @OptionalLazyInject(() => import("@tsed/platform-exceptions"))
 *   exceptions: Promise<PlatformException>;
 * }
 * ```
 *
 * @decorator
 */
export function OptionalLazyInject(resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function OptionalLazyInject(key: string, resolver: () => Promise<{default: unknown}>): PropertyDecorator;
export function OptionalLazyInject(...args: any[]): PropertyDecorator {
  let resolver = mapOptions(args, true);

  return (target: any, propertyKey: string | symbol): any | void => {
    catchError(() => Reflect.deleteProperty(target, propertyKey));
    Reflect.defineProperty(target, propertyKey, {
      async get() {
        return optionalLazyInject<any>(resolver as any);
      }
    });
  };
}
