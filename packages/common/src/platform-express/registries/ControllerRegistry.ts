import {GlobalProviders, LocalsContainer, ProviderType} from "@tsed/di";
import {ControllerProvider} from "../../platform";
import {ExpressRouter} from "../decorators/ExpressRouter";

const {onInvoke}: any = GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER);

GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER).onInvoke = (
  provider: ControllerProvider,
  locals: LocalsContainer<any>,
  deps: any[]
) => {
  locals.set(ExpressRouter, provider.router);
  onInvoke(provider, locals, deps);
};
