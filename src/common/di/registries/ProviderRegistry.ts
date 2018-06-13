import {Provider} from "../class/Provider";
import {Providers} from "../class/Providers";
import {IProvider, ProviderType, TypedProvidersRegistry} from "../interfaces";

/**
 *
 * @type {Providers}
 */
// tslint:disable-next-line: variable-name
export const GlobalProviders = new Providers();
/**
 *
 * @type {Providers}
 */
// tslint:disable-next-line: variable-name
export const ProviderRegistry: TypedProvidersRegistry = GlobalProviders.getRegistry(ProviderType.PROVIDER);
/**
 *
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
GlobalProviders.createRegistry(ProviderType.SERVICE, Provider, {
  injectable: true,
  buildable: true
});
/**
 *`
 * @type {Registry<Provider<any>, IProvider<any>>}
 */
GlobalProviders.createRegistry(ProviderType.FACTORY, Provider, {
  injectable: true,
  buildable: false
});

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
export const registerFactory = GlobalProviders.createRegisterFn(ProviderType.FACTORY);
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
export const registerService = GlobalProviders.createRegisterFn(ProviderType.SERVICE);

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
