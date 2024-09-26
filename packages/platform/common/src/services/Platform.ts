import {type ControllerProvider, Inject, Injectable, InjectorService, ProviderScope, type TokenProvider} from "@tsed/di";
import {type PlatformLayer, PlatformRouters} from "@tsed/platform-router";

import type {Route, RouteController} from "../interfaces/Route.js";
import {PlatformApplication} from "./PlatformApplication.js";
import {PlatformHandler} from "./PlatformHandler.js";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  imports: [PlatformHandler]
})
export class Platform {
  #layers: PlatformLayer[];

  constructor(
    @Inject(InjectorService) readonly injector: InjectorService,
    @Inject(PlatformApplication) readonly platformApplication: PlatformApplication,
    @Inject(PlatformRouters) readonly platformRouters: PlatformRouters
  ) {
    platformRouters.prebuild();
  }

  get app() {
    return this.platformApplication;
  }

  public addRoutes(routes: Route[]) {
    routes.forEach((routeSettings) => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  public addRoute(route: string, token: TokenProvider) {
    const provider = this.injector.getProvider(token) as ControllerProvider;

    if (!provider || provider.hasParent()) {
      return this;
    }

    const router = this.platformRouters.from(provider.token);

    this.app.use(route, router);

    return this;
  }

  public getLayers() {
    this.#layers = this.#layers || this.platformRouters.getLayers(this.app);

    return this.#layers;
  }

  /**
   * Get all controllers mounted on the application.
   * @returns  {RouteController[]}
   */
  public getMountedControllers() {
    const controllers = this.getLayers().reduce((controllers, layer) => {
      if (layer.isProvider()) {
        const route = String(layer.getBasePath());
        const key = `${layer.provider.toString()}:${route}`;

        if (!controllers.has(key)) {
          controllers.set(key, {
            route,
            routes: new Set(),
            provider: layer.provider
          });
        }

        controllers.get(key)!.routes.add(String(layer.path));
      }

      return controllers;
    }, new Map<string, RouteController>());

    return [...controllers.values()];
  }
}
