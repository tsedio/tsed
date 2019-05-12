/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
import {GlobalProviders, Provider, TypedProvidersRegistry} from "@tsed/common";

export const PROVIDER_TYPE_RESOLVER_SERVICE = "graphQLResolverService";

/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const ResolverServiceRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(PROVIDER_TYPE_RESOLVER_SERVICE, Provider, {
  injectable: true
});
/**
 * Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerResolverService, InjectorService} from "@tsed/graphql";
 *
 * export default class MyFooService {
 *     constructor(){}
 *     getFoo() {
 *         return "test";
 *     }
 * }
 *
 * registerResolverService({provide: MyFooService});
 * // or
 * registerResolverService(MyFooService);
 *
 * const injector = new InjectorService();
 * injector.load();
 *
 * const myFooService = injector.get<MyFooService>(MyFooService);
 * myFooService.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerResolverService = GlobalProviders.createRegisterFn(PROVIDER_TYPE_RESOLVER_SERVICE);
