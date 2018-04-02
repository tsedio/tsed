/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
import {GlobalProviders, Provider} from "@tsed/common";

export const MongooseModelRegistry = GlobalProviders.createRegistry("mongooseModel", Provider, {
    injectable: true,
    buildable: false
});
/**
 * Add a new model in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerModel, InjectorService} from "@tsed/common";
 *
 * export default class MyFooService {
 *     constructor(){}
 *     getFoo() {
 *         return "test";
 *     }
 * }
 *
 * registerModel({provide: MyFooService});
 * // or
 * registerModel(MyFooService);
 *
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<MyFooService>(MyFooService);
 * myFooService.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerModel = GlobalProviders.createRegisterFn("mongooseModel");