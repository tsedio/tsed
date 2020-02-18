"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 *
 * @type {Registry<Provider<any>, Provider>}
 */
// tslint:disable-next-line: variable-name
exports.MiddlewareRegistry = di_1.GlobalProviders.createRegistry(di_1.ProviderType.MIDDLEWARE, di_1.Provider, {
    injectable: true
});
/**
 * Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerMiddleware, InjectorService} from "@tsed/common";
 *
 * export default class FooMiddleware {
 *     constructor(){}
 *     use() {
 *         return "test";
 *     }
 * }
 *
 * registerMiddleware({provide: FooMiddleware});
 * // or
 * registerMiddleware(FooMiddleware);
 *
 * const injector = new InjectorService()
 * injector.load();
 *
 * const myFooService = injector.get<FooMiddleware>(FooMiddleware);
 * fooMiddleware.use(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
exports.registerMiddleware = di_1.GlobalProviders.createRegisterFn(di_1.ProviderType.MIDDLEWARE);
//# sourceMappingURL=MiddlewareRegistry.js.map