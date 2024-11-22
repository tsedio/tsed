import {ControllerProvider, inject, injectable, injector, ProviderScope, TokenProvider} from "@tsed/di";
import {PlatformLayer, PlatformRouters} from "@tsed/platform-router";

import {application} from "../fn/application.js";
import {Route, RouteController} from "../interfaces/Route.js";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
export class Platform {
  readonly platformRouters = inject(PlatformRouters);
  #layers: PlatformLayer[];

  constructor() {
    this.platformRouters.prebuild();
  }

  get app() {
    return application();
  }

  public addRoutes(routes: Route[]) {
    routes.forEach((routeSettings) => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  public addRoute(route: string, token: TokenProvider) {
    const app = application();
    const provider = injector().getProvider(token) as ControllerProvider;

    if (!provider || provider.hasParent()) {
      return this;
    }

    const router = this.platformRouters.from(provider.token);

    app.use(route, router);

    return this;
  }

  public getLayers() {
    this.#layers = this.#layers || this.platformRouters.getLayers(application());

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

injectable(Platform).scope(ProviderScope.SINGLETON);
