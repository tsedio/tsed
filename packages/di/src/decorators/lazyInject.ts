import {classOf, importPackage, isBoolean, isFunction, isString} from "@tsed/core";
import {injectProperty} from "./inject";

function mapOptions(args: any[]) {
  const options = args.reduce(
    (options, item) => {
      if (isString(item)) {
        options.packageName = item;
      } else if (isFunction(item)) {
        options.resolver = item;
      } else if (isBoolean(item)) {
        options.optional = item;
      }
      return options;
    },
    {optional: false}
  );

  if (!options.packageName && options.resolver) {
    options.packageName = options.resolver.toString();
  }

  if (!options.resolver) {
    options.resolver = () => import(options.packageName);
  }

  return options;
}

/**
 * Lazy load a provider from his package and invoke only when the provider is used
 *
 * ```typescript
 * import type {PlatformException} from "@tsed/platform-exceptions";
 *
 * @Injectable()
 * export class MyService {
 *   @LazyInject("@tsed/platform-exceptions") // work if the module have a class exported with "default"
 *   exceptions: Promise<PlatformException>;
 * }
 *
 * @Injectable()
 * export class MyService {
 *   @LazyInject(() => import("@tsed/platform-exceptions")) // use this notation is you use webpack
 *   exceptions: Promise<PlatformException>;
 * }
 *
 * @Injectable()
 * export class MyService {
 *   @LazyInject(async () => (await import("@tsed/platform-exceptions")).PlatformException)
 *   exceptions: Promise<PlatformException>;
 * }
 * ```
 *
 * @param packageName
 * @param resolver
 * @param optional
 * @returns {Function}
 * @decorator
 */
export function LazyInject(resolver: () => any, optional?: boolean): PropertyDecorator;
export function LazyInject(packageName: string, optional?: boolean): PropertyDecorator;
export function LazyInject(...args: any[]): PropertyDecorator {
  const {packageName, resolver, optional} = mapOptions(args);

  return (target: any, propertyKey: string): any | void => {
    let bean: any, token: any;
    injectProperty(target, propertyKey, {
      resolver(injector) {
        return async () => {
          if (!token) {
            token = await importPackage(packageName, resolver, optional);
            token = token?.default || token;

            if (token && classOf(token) === Object && !optional) {
              throw new Error(`Unable to lazy load the "${packageName}". Resolved token isn\'t a valid provider.`);
            }

            bean = await injector.lazyInvoke(token);
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
 * @param packageName
 * @param resolver
 * @returns {Function}
 * @decorator
 */
export function OptionalLazyInject(resolver: () => any): PropertyDecorator;
export function OptionalLazyInject(packageName: string): PropertyDecorator;
export function OptionalLazyInject(arg: string | (() => any)) {
  return (LazyInject as any)(arg, true);
}
