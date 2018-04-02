import {Registry} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {IProvider} from "../../di/interfaces/IProvider";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {GlobalProviders} from "../../di/registries/ProviderRegistry";
import {IFilterPreHandler} from "../interfaces/IFilterPreHandler";

/**
 * @deprecated
 * @type {Registry<Provider, IProvider<any>>}
 */
export const FilterRegistry = GlobalProviders.createRegistry(ProviderType.FILTER, Provider, {
    injectable: true,
    buildable: true
});

/**
 * Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerService, InjectorService} from "@tsed/common";
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
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<MyFooFilter>(MyFooFilter);
 * MyFooFilter.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerFilter = GlobalProviders.createRegisterFn(ProviderType.FILTER);
/**
 *
 * @type {Map<any, any>}
 */
export const FilterPreHandlers: Map<symbol, IFilterPreHandler> = new Map();
