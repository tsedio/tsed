import {GlobalProviders, LocalsContainer, ProviderType} from "@tsed/di";
import {ControllerProvider, PlatformRouter} from "../platform";
import {ExpressRouter} from "./decorators/ExpressRouter";

GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER).onInvoke = (provider: ControllerProvider, locals: LocalsContainer<any>) => {
  locals.set(ExpressRouter, provider.router);
  locals.set(PlatformRouter, provider.router);
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
