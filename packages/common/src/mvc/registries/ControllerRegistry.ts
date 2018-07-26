import {TypedProvidersRegistry, ProviderType, GlobalProviders} from "@tsed/di";
import {ControllerProvider} from "../class/ControllerProvider";
import {ExpressRouter} from "../services/ExpressRouter";

// tslint:disable-next-line: variable-name
export const ControllerRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider, {
  injectable: false,
  buildable: true,

  onInvoke(provider: ControllerProvider, locals, designParamTypes) {
    if (!locals.has(ExpressRouter)) {
      locals.set(ExpressRouter, provider.router);
    }
  }
});
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
export const registerController = GlobalProviders.createRegisterFn(ProviderType.FILTER);
