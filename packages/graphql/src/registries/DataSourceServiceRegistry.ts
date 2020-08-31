/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
import {GlobalProviders, Provider, TypedProvidersRegistry} from "@tsed/common";

export const PROVIDER_TYPE_DATASOURCE_SERVICE = "graphQLDataSourceService";

/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const DataSourceServiceRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(
  PROVIDER_TYPE_DATASOURCE_SERVICE,
  Provider,
  {
    injectable: true
  }
);
/**
 * Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerDataSourceService, InjectorService} from "@tsed/graphql";
 *
 * export default class MyFooService {
 *     constructor(){}
 *     getFoo() {
 *         return "test";
 *     }
 * }
 *
 * registerDataSourceService({provide: MyFooService});
 * // or
 * registerDataSourceService(MyFooService);
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
export const registerDataSourceService = GlobalProviders.createRegisterFn(PROVIDER_TYPE_DATASOURCE_SERVICE);
