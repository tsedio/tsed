"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 * Converter Registry.
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
// tslint:disable-next-line: variable-name
exports.ConverterRegistry = di_1.GlobalProviders.createRegistry(di_1.ProviderType.CONVERTER, di_1.Provider, {
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
exports.registerConverter = di_1.GlobalProviders.createRegisterFn(di_1.ProviderType.SERVICE);
//# sourceMappingURL=ConverterRegistries.js.map