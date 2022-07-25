import {getValue, Hooks, Type} from "@tsed/core";
import {ControllerProvider, GlobalProviders, Injectable, InjectorService, Provider, ProviderType, TokenProvider} from "@tsed/di";
import {concatPath, getOperationsRoutes} from "@tsed/schema";
import {useContextHandler} from "../utils/useContextHandler";
import {PlatformLayer} from "./PlatformLayer";
import {PlatformRouter} from "./PlatformRouter";

let AUTO_INC = 0;

function getInjectableRouter(injector: InjectorService, provider: Provider): PlatformRouter {
  return injector.get(provider.tokenRouter)!;
}

function createTokenRouter(provider: ControllerProvider) {
  return (provider.tokenRouter = provider.tokenRouter || `${provider.name}_ROUTER_${AUTO_INC++}`);
}

function createInjectableRouter(injector: InjectorService, provider: ControllerProvider): PlatformRouter {
  const tokenRouter = createTokenRouter(provider);

  if (injector.has(tokenRouter)) {
    return getInjectableRouter(injector, provider);
  }

  const router = injector.invoke<PlatformRouter>(PlatformRouter);
  router.provider = provider;

  return injector
    .add(tokenRouter, {
      useValue: router
    })
    .invoke<PlatformRouter>(tokenRouter);
}

GlobalProviders.createRegistry(ProviderType.CONTROLLER, ControllerProvider, {
  onInvoke(provider: ControllerProvider, locals: any, {injector}) {
    const router = createInjectableRouter(injector, provider);
    locals.set(PlatformRouter, router);
  }
});

@Injectable()
export class PlatformRouters {
  readonly hooks = new Hooks();

  constructor(protected readonly injector: InjectorService) {}

  prebuild() {
    this.injector.getProviders(ProviderType.CONTROLLER).forEach((provider: ControllerProvider) => {
      createInjectableRouter(this.injector, provider);
    });
  }

  from(token: TokenProvider, parentMiddlewares: any[] = []) {
    const {injector} = this;
    const provider = injector.getProvider<ControllerProvider>(token)!;

    if (!provider) {
      throw new Error("Token not found in the provider registry");
    }

    const router = createInjectableRouter(injector, provider);

    if (router.isBuilt()) {
      return router;
    }

    const useBefore = getValue(provider, "middlewares.useBefore", []);

    const {children} = provider;

    getOperationsRoutes(provider.token).forEach((operationRoute) => {
      const {endpoint} = operationRoute;
      const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

      const useBefore = getValue(provider, "middlewares.useBefore", []);
      const use = getValue(provider, "middlewares.use", []);
      const useAfter = getValue(provider, "middlewares.useAfter", []);

      const handlers = this.hooks.alter(
        "alterEndpointHandlers",
        [
          ...parentMiddlewares,
          ...useBefore,
          ...beforeMiddlewares,
          ...use,
          ...mldwrs,
          operationRoute.endpoint,
          ...afterMiddlewares,
          ...useAfter
        ],
        [operationRoute],
        this
      );

      router.addRoute(
        operationRoute.method,
        operationRoute.path || "",
        [
          useContextHandler(($ctx) => {
            $ctx.endpoint = operationRoute.endpoint;
          }),
          ...handlers
        ],
        operationRoute
      );
    });

    const middlewares: any[] = [...parentMiddlewares, ...useBefore];

    children.forEach((token: Type<any>) => {
      const nested = this.from(token, middlewares);

      router.use(nested);
    });

    return router;
  }

  getLayers(router: PlatformRouter): PlatformLayer[] {
    return router.layers
      .flatMap((layer) => {
        if (layer.router) {
          return this.getLayers(layer.router).map((subLayer: PlatformLayer) => {
            return new PlatformLayer({
              ...subLayer,
              path: concatPath(layer.path, subLayer.path)
            });
          });
        }

        return new PlatformLayer(layer);
      })
      .map((layer) => {
        const handlers = layer.handlers.map((handlerMetadata) => {
          // set path on handler metadata to retrieve it later in $ctx
          handlerMetadata.path = layer.path;

          return this.hooks.alter("alterHandler", handlerMetadata);
        });

        layer.set(handlers);

        return layer;
      });
  }
}
