import {GlobalProviders, LocalsContainer, ProviderType} from "@tsed/di";
import {ControllerProvider} from "../platform";
import {ExpressRouter} from "./decorators/ExpressRouter";

const {onInvoke}: any = GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER);

GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER).onInvoke = (
  provider: ControllerProvider,
  locals: LocalsContainer<any>,
  deps: any[]
) => {
  locals.set(ExpressRouter, provider.router);
  onInvoke(provider, locals, deps);
};

export * from "./interfaces";
export * from "./components/ServerLoader";
export * from "./middlewares/GlobalAcceptMimesMiddleware";
export * from "./middlewares/GlobalErrorHandlerMiddleware";
export * from "./middlewares/LogIncomingRequestMiddleware";

// DECORATORS
export * from "./decorators/serverSettings";
export * from "./decorators/expressApplication";
export * from "./decorators/ExpressRouter";

// SERVICE
export * from "./services/ServeStaticService";

// UTILS
export * from "./utils";
