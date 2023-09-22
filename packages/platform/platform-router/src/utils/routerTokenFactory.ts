import {Type} from "@tsed/core";
import {ControllerProvider, GlobalProviders, InjectorService, Provider, ProviderType} from "@tsed/di";
import {PlatformBaseRouter} from "../domain/PlatformBaseRouter";

export function routerTokenFactory<BaseRouter extends PlatformBaseRouter = PlatformBaseRouter>(
  namespace: string,
  Router: Type<BaseRouter>
) {
  let AUTO_INC = 0;

  function getInjectableRouter(injector: InjectorService, provider: Provider): BaseRouter {
    return injector.get(provider.routers[namespace])!;
  }

  function createTokenRouter(provider: ControllerProvider) {
    return (provider.routers[namespace] =
      provider.routers[namespace] || `${provider.name}_${namespace.toUpperCase()}_ROUTER_${AUTO_INC++}`);
  }

  function createInjectableRouter(injector: InjectorService, provider: ControllerProvider): BaseRouter {
    const tokenRouter = createTokenRouter(provider);

    if (injector.has(tokenRouter)) {
      return getInjectableRouter(injector, provider);
    }

    const router = injector.invoke<BaseRouter>(Router);
    router.provider = provider;

    return injector
      .add(tokenRouter, {
        useValue: router
      })
      .invoke<BaseRouter>(tokenRouter);
  }

  GlobalProviders.on(ProviderType.CONTROLLER, (provider: ControllerProvider, locals: any, {injector}) => {
    const router = createInjectableRouter(injector, provider);
    locals.set(Router, router);
  });

  return {
    createTokenRouter,
    createInjectableRouter,
    getInjectableRouter
  };
}
