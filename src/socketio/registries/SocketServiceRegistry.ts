/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
import {GlobalProviders, Provider} from "@tsed/common";

/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
export const SocketServiceRegistry = GlobalProviders.createRegistry("socketService", Provider, {
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
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<MyFooService>(MyFooService);
 * myFooService.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerSocketService = GlobalProviders.createRegisterFn("socketService");