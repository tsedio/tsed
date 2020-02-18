"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 *
 * @type {Registry<Provider, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
exports.FilterRegistry = di_1.GlobalProviders.createRegistry(di_1.ProviderType.FILTER, di_1.Provider, {
    injectable: true
});
/**
 * Add a new filter in the `ProviderRegistry`. This filter will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerFilter, InjectorService} from "@tsed/common";
 *
 * export default class MyFooFilter {
 *     constructor(){}
 *     transform() {
 *         return "test";
 *     }
 * }
 *
 * registerFilter({provide: MyFooService});
 * // or
 * registerFilter(MyFooService);
 *
 * const injector = new InjectorService();
 *
 * const myFooService = injector.get<MyFooFilter>(MyFooFilter);
 * myFooFilter.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
exports.registerFilter = di_1.GlobalProviders.createRegisterFn(di_1.ProviderType.FILTER);
//# sourceMappingURL=FilterRegistry.js.map