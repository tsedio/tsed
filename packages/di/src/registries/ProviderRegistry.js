"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Provider_1 = require("../class/Provider");
const interfaces_1 = require("../interfaces");
const GlobalProviders_1 = require("./GlobalProviders");
/**
 *
 * @type {GlobalProviderRegistry}
 */
// tslint:disable-next-line: variable-name
GlobalProviders_1.GlobalProviders.getRegistry(interfaces_1.ProviderType.PROVIDER);
/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
GlobalProviders_1.GlobalProviders.createRegistry(interfaces_1.ProviderType.SERVICE, Provider_1.Provider);
/**
 *`
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
GlobalProviders_1.GlobalProviders.createRegistry(interfaces_1.ProviderType.FACTORY, Provider_1.Provider);
/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
GlobalProviders_1.GlobalProviders.createRegistry(interfaces_1.ProviderType.INTERCEPTOR, Provider_1.Provider);
/**
 *
 */
GlobalProviders_1.GlobalProviders.createRegistry(interfaces_1.ProviderType.CONTROLLER, Provider_1.Provider, {
    injectable: false
});
/**
 * Register a provider configuration.
 * @param {IProvider<any>} provider
 */
function registerProvider(provider) {
    if (!provider.provide) {
        throw new Error("Provider.provide is required");
    }
    GlobalProviders_1.GlobalProviders.merge(provider.provide, provider);
}
exports.registerProvider = registerProvider;
/**
 * Add a new factory in the `ProviderRegistry`.
 *
 * #### Example with symbol definition
 *
 *
 * ```typescript
 * import {registerFactory, InjectorService} from "@tsed/common";
 *
 * export interface IMyFooFactory {
 *    getFoo(): string;
 * }
 *
 * export type MyFooFactory = IMyFooFactory;
 * export const MyFooFactory = Symbol("MyFooFactory");
 *
 * registerFactory(MyFooFactory, {
 *      getFoo:  () => "test"
 * });
 *
 * // or
 *
 * registerFactory({provide: MyFooFactory, instance: {
 *      getFoo:  () => "test"
 * }});
 *
 * @Service()
 * export class OtherService {
 *      constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
 *          console.log(myFooFactory.getFoo()); /// "test"
 *      }
 * }
 * ```
 *
 * > Note: When you use the factory method with Symbol definition, you must use the `@Inject()`
 * decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by
 * `Factory`.
 *
 * #### Example with class
 *
 * ```typescript
 * import {InjectorService, registerFactory} from "@tsed/common";
 *
 * export class MyFooService {
 *  constructor(){}
 *      getFoo() {
 *          return "test";
 *      }
 * }
 *
 * registerFactory(MyFooService, new MyFooService());
 * // or
 * registerFactory({provider: MyFooService, instance: new MyFooService()});
 *
 * @Service()
 * export class OtherService {
 *      constructor(myFooService: MyFooService){
 *          console.log(myFooFactory.getFoo()); /// "test"
 *      }
 * }
 * ```
 *
 */
exports.registerFactory = (provider, instance) => {
    if (!provider.provide) {
        provider = {
            provide: provider
        };
    }
    provider = Object.assign({
        scope: interfaces_1.ProviderScope.SINGLETON,
        useFactory() {
            return instance;
        }
    }, provider, { type: interfaces_1.ProviderType.FACTORY });
    GlobalProviders_1.GlobalProviders.getRegistry(interfaces_1.ProviderType.FACTORY).merge(provider.provide, provider);
};
/**
 * Add a new value in the `ProviderRegistry`.
 *
 * #### Example with symbol definition
 *
 *
 * ```typescript
 * import {registerValue, InjectorService} from "@tsed/common";
 *
 * const MyValue = Symbol.from("MyValue")
 *
 * registerValue(MyValue, "myValue");
 *
 * @Service()
 * export class OtherService {
 *      constructor(@Inject(MyValue) myValue: string){
 *          console.log(myValue); /// "myValue"
 *      }
 * }
 * ```
 */
exports.registerValue = (provider, value) => {
    if (!provider.provide) {
        provider = {
            provide: provider
        };
    }
    provider = Object.assign({
        scope: interfaces_1.ProviderScope.SINGLETON,
        useValue: value
    }, provider, { type: interfaces_1.ProviderType.VALUE });
    GlobalProviders_1.GlobalProviders.getRegistry(interfaces_1.ProviderType.VALUE).merge(provider.provide, provider);
};
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
 * registerService({provide: MyFooService});
 * // or
 * registerService(MyFooService);
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
exports.registerService = GlobalProviders_1.GlobalProviders.createRegisterFn(interfaces_1.ProviderType.SERVICE);
/**
 * Add a new controller in the `ProviderRegistry`. This controller will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerController, InjectorService} from "@tsed/common";
 *
 * export default class MyController {
 *     constructor(){}
 *     transform() {
 *         return "test";
 *     }
 * }
 *
 * registerController({provide: MyController});
 * // or
 * registerController(MyController);
 *
 * const injector = new InjectorService();
 * injector.load();
 *
 * const myController = injector.get<MyController>(MyController);
 * myController.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
exports.registerController = GlobalProviders_1.GlobalProviders.createRegisterFn(interfaces_1.ProviderType.CONTROLLER);
/**
 * Add a new interceptor in the `ProviderRegistry`. This interceptor will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerInterceptor, InjectorService} from "@tsed/common";
 *
 * export default class MyInterceptor {
 *     intercept() {
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
 * myInterceptor.intercept(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
exports.registerInterceptor = GlobalProviders_1.GlobalProviders.createRegisterFn(interfaces_1.ProviderType.INTERCEPTOR);
//# sourceMappingURL=ProviderRegistry.js.map