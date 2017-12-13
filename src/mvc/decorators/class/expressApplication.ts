import * as Express from "express";
import {Type} from "../../../core/interfaces";
import {Inject} from "../../../di/decorators/inject";

/**
 * `ExpressApplication` is an alias type to the [Express.Application](http://expressjs.com/fr/4x/api.html#app) interface. It use the new feature `Injector.factory()` and let you to inject [Express.Application](http://expressjs.com/fr/4x/api.html#app) created by [ServerLoader](docs/server-loader/lifecycle-hooks.md).
 *
 * ```typescript
 * import {ExpressApplication, Service, Inject} from "ts-express-decorators";
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
 * import {ExpressApplication, Service, Inject} from "ts-express-decorators";
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