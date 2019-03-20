/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
import {GlobalProviders, Provider, TypedProvidersRegistry} from "@tsed/common";

export const PROVIDER_TYPE_SOCKET_SERVICE = "socketService";
/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const SocketServiceRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(PROVIDER_TYPE_SOCKET_SERVICE, Provider, {
  injectable: true
});
/**
 * Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerSocketService, InjectorService} from "@tsed/common";
 *
 * export default class MyFooService {
 *     constructor(){}
 *     getFoo() {
 *         return "test";
 *     }
 * }
 *
 * registerSocketService({provide: MyFooService});
 * // or
 * registerSocketService(MyFooService);
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
export const registerSocketService = GlobalProviders.createRegisterFn(PROVIDER_TYPE_SOCKET_SERVICE);
