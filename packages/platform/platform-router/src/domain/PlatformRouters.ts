import {getValue, Hooks, Type} from "@tsed/core";
import {ControllerProvider, GlobalProviders, Injectable, InjectorService, Provider, ProviderType, TokenProvider} from "@tsed/di";
import {PlatformParamsCallback} from "@tsed/platform-params";
import {concatPath, getOperationsRoutes, JsonMethodStore, OPERATION_HTTP_VERBS} from "@tsed/schema";

import {useContextHandler} from "../utils/useContextHandler.js";
import {PlatformHandlerMetadata} from "./PlatformHandlerMetadata.js";
import {PlatformLayer} from "./PlatformLayer.js";
import {PlatformRouter} from "./PlatformRouter.js";

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

export interface AlterEndpointHandlersArg {
  before: (Type<any> | Function)[];
  endpoint: JsonMethodStore;
  after: (Type<any> | Function)[];
}

@Injectable()
export class PlatformRouters {
  readonly hooks = new Hooks();
  readonly allowedVerbs = OPERATION_HTTP_VERBS;

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
    const middlewares: any[] = [...parentMiddlewares, ...useBefore];
    const {children} = provider;

    // Set default to true in next major version
    const appendChildrenRoutesFirst = this.injector.settings.get<boolean>("router.appendChildrenRoutesFirst", false);

    if (appendChildrenRoutesFirst) {
      children.forEach((token: Type<any>) => {
        const nested = this.from(token, middlewares);
        router.use(nested);
      });
    }

    getOperationsRoutes(provider.token, {allowedVerbs: this.allowedVerbs}).forEach((operationRoute) => {
      const {endpoint} = operationRoute;
      const {beforeMiddlewares, middlewares: mldwrs, afterMiddlewares} = endpoint;

      const useBefore = getValue(provider, "middlewares.useBefore", []);
      const use = getValue(provider, "middlewares.use", []);
      const useAfter = getValue(provider, "middlewares.useAfter", []);

      let handlers = this.hooks.alter<AlterEndpointHandlersArg>(
        "alterEndpointHandlers",
        {
          before: [...parentMiddlewares, ...useBefore, ...beforeMiddlewares, ...use, ...mldwrs],
          endpoint,
          after: [...afterMiddlewares, ...useAfter]
        },
        [operationRoute],
        this
      );

      handlers = this.sortHandlers(handlers);

      router.addRoute(
        operationRoute.method,
        operationRoute.path || "",
        [
          useContextHandler(($ctx) => {
            $ctx.endpoint = operationRoute.endpoint;
          }),
          ...[...handlers.before, handlers.endpoint, ...handlers.after]
        ],
        operationRoute
      );
    });

    if (!appendChildrenRoutesFirst) {
      children.forEach((token: Type<any>) => {
        const nested = this.from(token, middlewares);
        router.use(nested);
      });
    }

    return router;
  }

  getLayers(router: PlatformRouter): PlatformLayer[] {
    return this.flatMapLayers(router.layers);
  }

  private sortHandlers(handlers: AlterEndpointHandlersArg) {
    const get = (token: TokenProvider) => {
      return this.injector.getProvider(token)?.priority || 0;
    };

    const sort = (p1: TokenProvider, p2: TokenProvider) => (get(p1) < get(p2) ? -1 : get(p1) > get(p2) ? 1 : 0);

    handlers.before = handlers.before.sort(sort);
    handlers.after = handlers.after.sort(sort);

    return handlers;
  }

  private flatMapLayers(layers: PlatformLayer[]): PlatformLayer[] {
    return layers
      .flatMap((layer) => {
        if (layer.router) {
          return this.flatMapLayers(layer.layers).map((subLayer: PlatformLayer) => {
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

          if (handlerMetadata.isRawFn()) {
            return handlerMetadata.handler;
          }

          return this.hooks.alter<PlatformHandlerMetadata, PlatformParamsCallback>("alterHandler", handlerMetadata);
        });

        layer.set(handlers);

        return layer;
      });
  }
}
