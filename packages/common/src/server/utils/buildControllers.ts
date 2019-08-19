import {InjectorService, ProviderType} from "@tsed/di";
import {ControllerBuilder, ControllerProvider} from "../../mvc";

export function buildControllers(injector: InjectorService) {
  return injector
    .getProviders(ProviderType.CONTROLLER)
    .map(provider => {
      if (!provider.hasParent()) {
        return new ControllerBuilder(provider as ControllerProvider).build(injector);
      }
    })
    .filter(Boolean);
}
