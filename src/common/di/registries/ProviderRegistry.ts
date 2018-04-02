import {Registry} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider} from "../interfaces";
import {ProviderType} from "../interfaces/ProviderType";

export const ProviderRegistry = new Registry<Provider<any>, IProvider<any>>(Provider);

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
export function registerFactory(provider: any | IProvider<any>, instance?: any): void {

    if (!provider.provide) {
        provider = {
            provide: provider
        };
    }

    provider = Object.assign({instance}, provider, {type: ProviderType.FACTORY});
    registerProvider(provider);
}

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
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<MyFooService>(MyFooService);
 * myFooService.getFoo(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export function registerService(provider: any | IProvider<any>): void {

    if (!provider.provide) {
        provider = {
            provide: provider
        };
    }

    provider = Object.assign(provider, {type: ProviderType.SERVICE});
    registerProvider(provider);
}

/**
 * Register a provider configuration.
 * @param {IProvider<any>} provider
 */
export function registerProvider(provider: Partial<IProvider<any>>): void {

    if (!provider.provide) {
        throw new Error("Provider.provide is required");
    }

    ProviderRegistry.merge(provider.provide, provider);
}

/**
 *
 * @param target
 * @returns {boolean}
 */
/*export function hasProvider(target: any): boolean {
    return ProviderRegistry.has(target);
}*/


/**
 *
 * @param target
 * @returns {Provider<T>}
 */
/*export function getProvider<T>(target: any): Provider<T> {
    return ProviderRegistry.get(target)!;
}*/

/**
 *
 * @param target
 * @returns {T}
 */
/*export function getInstanceProvider<T>(target: any): T {
    return ProviderRegistry.get(target)!.instance;
}*/