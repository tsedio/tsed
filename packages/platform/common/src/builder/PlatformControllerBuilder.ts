import {Type} from "@tsed/core";
import {GlobalProviders, InjectorService, ProviderType} from "@tsed/di";
import {getOperationsRoutes, OperationMethods} from "@tsed/schema";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouter} from "../services/PlatformRouter";
import {PlatformMiddlewaresChain} from "../services/PlatformMiddlewaresChain";

GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider, {
  onInvoke(provider: ControllerProvider, locals: any, {injector}) {
    const router = createRouter(injector, provider);
    locals.set(PlatformRouter, router);
  }
});

/**
 * @ignore
 */
function formatMethod(method: string | undefined) {
  return (method === OperationMethods.CUSTOM ? "use" : method || "use").toLowerCase();
}

/**
 * @ignore
 */
export function getRouter(injector: InjectorService, provider: ControllerProvider) {
  return injector.get(provider.tokenRouter)!;
}

/**
 * @ignore
 */
export function createRouter(injector: InjectorService, provider: ControllerProvider): PlatformRouter {
  const token = provider.tokenRouter;

  if (injector.has(token)) {
    return getRouter(injector, provider);
  }

  const router = PlatformRouter.create(injector, provider.routerOptions);

  return injector
    .add(token, {
      useValue: router
    })
    .invoke<PlatformRouter>(token);
}

/**
 * @ignore
 * @param injector
 * @param provider
 */
export function buildRouter(injector: InjectorService, provider: ControllerProvider) {
  const {
    middlewares: {useBefore},
    children
  } = provider;

  // Controller lifecycle
  const router = createRouter(injector, provider);

  if (!router.isBuilt) {
    router.isBuilt = true;

    const platformMiddlewaresChain = injector.get<PlatformMiddlewaresChain>(PlatformMiddlewaresChain);

    useBefore // Controller before-middleware
      .filter((o) => typeof o === "function")
      .forEach((middleware: any) => {
        router.use(middleware);
      });

    // build all endpoints and his middlewares
    getOperationsRoutes(provider.token).forEach((operationRoute) => {
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
