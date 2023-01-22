import {ControllerProvider, Injectable, InjectorService, ProviderScope, TokenProvider} from "@tsed/di";
import {PlatformLayer, PlatformRouters} from "@tsed/platform-router";
import {Route, RouteController} from "../interfaces/Route";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformHandler} from "./PlatformHandler";

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
    readonly injector: InjectorService,
    readonly platformApplication: PlatformApplication,
    readonly platformRouters: PlatformRouters
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
        controllers.set(layer.provider.token, {
          route: String(layer.getBasePath()),
          provider: layer.provider
        });
      }

      return controllers;
    }, new Map<string, RouteController>());

    return [...controllers.values()];
  }
}
