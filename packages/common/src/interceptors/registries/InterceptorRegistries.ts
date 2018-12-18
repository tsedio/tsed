import {Provider} from "../../../../di/src/class/Provider";
import {ProviderType, TypedProvidersRegistry} from "../../../../di/src/interfaces";
import {GlobalProviders} from "../../../../di/src/registries/ProviderRegistry";

/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const InterceptorRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.INTERCEPTOR, Provider, {
  injectable: true,
  buildable: true
});
/**
 * Add a new interceptor in the `ProviderRegistry`. This interceptor will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerInterceptor, InjectorService} from "@tsed/common";
 *
 * export default class MyInterceptor {
 *     constructor(){}
 *     aroundInvoke() {
 *         return "test";
 *     }
 * }
 *
 * registerInterceptor({provide: MyInterceptor});
 * // or
 * registerInterceptor(MyInterceptor);
 *
 * const injector = new InjectorService()
 * injector.load();
 *
 * const myInterceptor = injector.get<MyInterceptor>(MyInterceptor);
 * myInterceptor.aroundInvoke(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerInterceptor = GlobalProviders.createRegisterFn(ProviderType.INTERCEPTOR);
