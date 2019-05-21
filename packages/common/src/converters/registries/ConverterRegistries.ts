import {Provider, ProviderType, TypedProvidersRegistry, GlobalProviders} from "@tsed/di";

/**
 * Converter Registry.
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
export const ConverterRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.CONVERTER, Provider, {
  injectable: true
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
 * const injector = new InjectorService();
 * injector.load();
 *
 * const myConverter = injector.get<MyConverter>(MyConverter);
 * myConverter.serialize(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerConverter = GlobalProviders.createRegisterFn(ProviderType.SERVICE);
