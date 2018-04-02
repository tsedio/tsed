import {Provider} from "../../di/class/Provider";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {GlobalProviders} from "../../di/registries/ProviderRegistry";

/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
export const ConverterRegistry = GlobalProviders.createRegistry(ProviderType.CONVERTER, Provider, {
    injectable: true,
    buildable: true
});
/**
 * Add a new converter in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerConverter, InjectorService} from "@tsed/common";
 *
 * export default class MyFooService {
 *     constructor(){}
 *     getFoo() {
 *         return "test";
 *     }
 * }
 *
 * registerConverter({provide: MyFooService});
 * // or
 * registerConverter(MyFooService);
 *
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<MyFooService>(MyFooService);
 * myFooService.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerConverter = GlobalProviders.createRegisterFn(ProviderType.SERVICE);