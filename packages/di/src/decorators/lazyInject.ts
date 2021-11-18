import {importPackage} from "@tsed/core";
import {injectProperty} from "./inject";

/**
 * Lazy load a provider from his package and invoke only when the provider is used
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 *
 * @Injectable()
 * export class MyService {
 *   @LazyInject("PlatformException", () => import("@tsed/platform-exceptions"))
 *   exceptions: Promise<PlatformException>;
 * }
 * ```
 *
 * @param key
 * @param packageName
 * @param resolver
 * @param optional
 * @returns {Function}
 * @decorator
 */
export function LazyInject(
  key: string,
  resolver: () => any,
  {optional = false, packageName = resolver.toString()}: {optional?: boolean; packageName?: string} = {}
): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    let bean: any, token: any;
    injectProperty(target, propertyKey, {
      resolver(injector) {
        return async () => {
          if (!token) {
            const exports = await importPackage(packageName, resolver, optional);
            token = exports[key];

            if (!token) {
              if (!optional) {
                throw new Error(`Unable to lazy load the "${key}". The token isn\'t a valid token provider.`);
              }
            }

            bean = token ? await injector.lazyInvoke(token) : {};
          }

          return bean;
        };
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
 *   @OptionalLazyInject("@tsed/platform-exceptions")
 *   exceptions: Promise<PlatformException>;
 * }
 * ```
 *
 * @param key
 * @param resolver
 * @returns {Function}
 * @decorator
 */
export function OptionalLazyInject(key: string, resolver: () => any): PropertyDecorator {
  return (LazyInject as any)(key, resolver, {optional: true});
}
