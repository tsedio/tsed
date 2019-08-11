import {GlobalProviders, Provider, ProviderType, TypedProvidersRegistry} from "@tsed/di";

/**
 *
 * @type {Registry<Provider, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const FilterRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.FILTER, Provider, {
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
export const registerFilter = GlobalProviders.createRegisterFn(ProviderType.FILTER);
