import {GlobalProviders, ProviderType, TypedProvidersRegistry} from "@tsed/di";
import {ControllerProvider} from "../models/ControllerProvider";
import {ExpressRouter} from "../services/ExpressRouter";

// tslint:disable-next-line: variable-name
export const ControllerRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider, {
  injectable: false,

  onInvoke(provider: ControllerProvider, locals: any) {
    locals.set(ExpressRouter, provider.router);
  }
});
