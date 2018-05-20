import {InjectorService} from "@tsed/common";
import {Type} from "@tsed/core";
import * as Express from "express";
import {Inject} from "../../../di/decorators/inject";
import {ProviderRegistry, registerFactory} from "../../../di/registries/ProviderRegistry";
import {HandlerBuilder} from "../../class/HandlerBuilder";

declare global {
  namespace Express {
    interface Application {
      use: (middleware: any) => Application;
    }
  }
}
/**
 * `ExpressApplication` is an alias type to the [Express.Application](http://expressjs.com/fr/4x/api.html#app) interface. It use the util `registerFactory()` and let you to inject [Express.Application](http://expressjs.com/fr/4x/api.html#app) created by [ServerLoader](docs/server-loader/lifecycle-hooks.md).
 *
 * ```typescript
 * import {ExpressApplication, Service, Inject} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@ExpressApplication expressApplication: Express.Application) {}
 * }
 * ```
 *
 * > Note: TypeScript transform and store `ExpressApplication` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
 *
 * @type {symbol}
 */
export type ExpressApplication = Express.Application;

/**
 * Inject the express application instance.
 *
 *
 * ```typescript
 * import {ExpressApplication, Service, Inject} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@ExpressApplication expressApplication: Express.Application) {}
 * }
 * ```
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
export function ExpressApplication(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(ExpressApplication)(target, targetKey, descriptor);
}

/**
 *
 */
export function createExpressApplication(): ExpressApplication {
  const expressApp = Express();
  const originalUse = expressApp.use;

  expressApp.use = function (...args: any[]) {
    args = args.map(arg => {
      if (ProviderRegistry.has(arg)) {
        arg = HandlerBuilder.from(arg).build(InjectorService.get<InjectorService>(InjectorService));
      }

      return arg;
    });

    return originalUse.call(this, ...args);
  };

  registerFactory(ExpressApplication, expressApp);

  return expressApp;
}
