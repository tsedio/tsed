import {Provider} from "../../di/class/Provider";
import {ProviderType, TypedProvidersRegistry} from "../../di/interfaces";
import {GlobalProviders} from "../../di/registries/ProviderRegistry";

/**
 * Converter Registry.
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
export const ConverterRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.CONVERTER, Provider, {
    injectable: true,
    buildable: true
});
/**
 * Add a new converter in the `ProviderRegistry`. This converter will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerConverter, InjectorService} from "@tsed/common";
 *
 * export default class MyConverter {
 *     constructor(){}
 *     serialize() {
 *         return "test";
 *     }
 * }
 *
 * registerConverter({provide: MyConverter});
 * // or
 * registerConverter(MyConverter);
 *
 * InjectorService.load();
 *
 * const myConverter = InjectorService.get<MyConverter>(MyConverter);
 * myConverter.serialize(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerConverter = GlobalProviders.createRegisterFn(ProviderType.SERVICE);