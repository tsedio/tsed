import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {getOperationsRoutes, OperationMethods} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouter} from "../services/PlatformRouter";
import {EndpointMetadata} from "../domain/EndpointMetadata";
import {PlatformMiddlewaresChain} from "../services/PlatformMiddlewaresChain";

/**
 * @ignore
 */
function formatMethod(method: string | undefined) {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase();
}

export function buildRouter(injector: InjectorService, provider: ControllerProvider) {
  const {
    middlewares: {useBefore},
    children
  } = provider;

  // Controller lifecycle
  const router = provider.getRouter<PlatformRouter>();

  if (!router.isBuilt) {
    router.isBuilt = true;

    const platformMiddlewaresChain = injector.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);

    useBefore // Controller before-middleware
      .filter((o) => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(middleware);
      });

    // build all endpoints and his middlewares
    getOperationsRoutes<EndpointMetadata>(provider.token).forEach((operationRoute) => {
      const handlers = platformMiddlewaresChain?.get(provider, operationRoute);

      router.addRoute({
        handlers,
        token: operationRoute.token,
        method: formatMethod(operationRoute.method),
        path: operationRoute.path,
        isFinal: operationRoute.isFinal
      });
    });

    // build children controllers
    children.forEach((child: Type<any>) => {
      const childProvider = injector.getProvider(child) as ControllerProvider;

      /* istanbul ignore next */
      if (!childProvider) {
        throw new Error("Controller component not found in the ControllerRegistry");
      }

      router.use(childProvider.path, buildRouter(injector, childProvider));
    });
  }

  return router;
}
