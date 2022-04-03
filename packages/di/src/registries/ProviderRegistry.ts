import {Provider} from "../domain/Provider";
import {ProviderScope} from "../domain/ProviderScope";
import {ProviderType} from "../domain/ProviderType";
import type {ProviderOpts} from "../interfaces/ProviderOpts";
import {GlobalProviders} from "./GlobalProviders";

/**
 *
 */
GlobalProviders.createRegistry(ProviderType.CONTROLLER, Provider);

/**
 * Register a provider configuration.
 * @param {ProviderOpts<any>} provider
 */
export function registerProvider(provider: Partial<ProviderOpts>): void {
  if (!provider.provide) {
    throw new Error("Provider.provide is required");
  }

  GlobalProviders.merge(provider.provide, provider);
}

/**
 * Add a new factory in the `ProviderRegistry`.
 *
 * #### Example with symbol definition
 *
 *
 * ```typescript
 * import {registerFactory, InjectorService} from "@tsed/di";
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
 * import {InjectorService, registerFactory} from "@tsed/di";
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
 * @deprecated Since 2021-05-15. Use registerProvider instead.
 */
export const registerFactory = registerProvider;

/**
 * Add a new value in the `ProviderRegistry`.
 *
 * #### Example with symbol definition
 *
 *
 * ```typescript
 * import {registerValue, InjectorService} from "@tsed/di";
 *
 * const MyValue = Symbol.from("MyValue")
 *
 * registerValue({token: MyValue, useValue: "myValue"});
 *
 * @Service()
 * export class OtherService {
 *      constructor(@Inject(MyValue) myValue: string){
 *          console.log(myValue); /// "myValue"
 *      }
 * }
 * ```
 */
export const registerValue = (provider: any | ProviderOpts<any>, value?: any): void => {
  if (!provider.provide) {
    provider = {
      provide: provider
    };
  }

  provider = Object.assign(
    {
      scope: ProviderScope.SINGLETON,
      useValue: value
    },
    provider,
    {type: ProviderType.VALUE}
  );
  GlobalProviders.merge(provider.provide, provider);
};

/**
 * Add a new controller in the `ProviderRegistry`. This controller will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerController, InjectorService} from "@tsed/di";
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
export const registerController = GlobalProviders.createRegisterFn(ProviderType.CONTROLLER);
