import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {GlobalProviders} from "./GlobalProviders.js";

/**
 *
 */
GlobalProviders.createRegistry(ProviderType.CONTROLLER, Provider);

/**
 * Register a provider configuration.
 * @param {ProviderOpts<any>} provider
 */
export function registerProvider<Type = any>(provider: Partial<ProviderOpts<Type>>) {
  if (!provider.provide) {
    throw new Error("Provider.provide is required");
  }

  return GlobalProviders.merge(provider.provide, provider);
}

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
