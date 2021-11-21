import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {concatPath, getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import {buildRouter, createRouter, getRouter} from "../builder/PlatformControllerBuilder";
import {ControllerProvider, EndpointMetadata, PlatformRouteDetails} from "../domain";
import {Route, RouteController} from "../interfaces/Route";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformMiddlewaresChain} from "./PlatformMiddlewaresChain";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  imports: [PlatformMiddlewaresChain]
})
export class Platform {
  private _routes: PlatformRouteDetails[] = [];
  private _controllers: RouteController[] = [];

  constructor(readonly injector: InjectorService, readonly platformApplication: PlatformApplication) {
    this.createRouters();
  }

  get app() {
    return this.platformApplication;
  }

  get routes(): PlatformRouteDetails[] {
    return this._routes;
  }

  public addRoutes(routes: Route[]) {
    routes.forEach((routeSettings) => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  public addRoute(basePath: string, token: TokenProvider) {
    const {injector} = this;
    const provider = injector.getProvider(token) as ControllerProvider;

    if (!provider || provider.hasParent()) {
      return;
    }

    const ctrlPath = concatPath(basePath, JsonEntityStore.from(provider.token).path);

    this._controllers.push({
      route: ctrlPath,
      provider
    });

    this.app.use(ctrlPath, ...[].concat(getRouter(injector, provider).callback()));

    this._routes = getOperationsRoutes<EndpointMetadata>(provider.token, {
      withChildren: true,
      basePath
    }).reduce((routes, operationRoute) => {
      if (injector.hasProvider(token)) {
        const provider = injector.getProvider(operationRoute.token) as ControllerProvider;
        const route = new PlatformRouteDetails({
          ...operationRoute,
          provider
        });

        return routes.concat(route);
      }

      return routes;
    }, this._routes);

    return this;
  }

  /**
   * Get all routes built by TsExpressDecorators and mounted on Express application.
   * @returns {PlatformRouteDetails[]}
   */
  public getRoutes(): PlatformRouteDetails[] {
    return this._routes;
  }

  public getMountedControllers(): RouteController[] {
    return this._controllers;
  }

  protected $onInit() {
    this.buildControllers();
  }

  /**
   * Create routers from the collected controllers.
   * @private
   */
  private createRouters() {
    const {injector} = this;

    injector.getProviders(ProviderType.CONTROLLER).map((provider: ControllerProvider) => {
      createRouter(injector, provider);
    });
  }

  /**
   * Create controllers from DI
   * @private
   */
  private buildControllers() {
    const {injector} = this;

    injector.getProviders(ProviderType.CONTROLLER).map((provider: ControllerProvider) => {
      if (!provider.hasParent()) {
        return buildRouter(injector, provider);
      }
    });
  }
}
