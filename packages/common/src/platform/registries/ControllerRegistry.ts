import {GlobalProviders, ProviderType, TypedProvidersRegistry} from "@tsed/di";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouter} from "../services/PlatformRouter";

// tslint:disable-next-line: variable-name
export const ControllerRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider, {
  injectable: false,

  onInvoke(provider: ControllerProvider, locals: any) {
    locals.set(PlatformRouter, provider.router);
  }
});
