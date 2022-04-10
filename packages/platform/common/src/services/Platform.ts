import {Type} from "@tsed/core";
import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {concatPath, EndpointMetadata, getJsonEntityStore, getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import {buildRouter, createRouter, getRouter} from "../builder/PlatformControllerBuilder";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails";
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

    this._controllers.push(...this.getAllControllers(basePath, token));

    const ctrlPath = concatPath(basePath, JsonEntityStore.from(provider.token).path);

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

        routes = routes.concat(route);
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

  /**
   * Get all controllers mounted on the application.
   * @returns  {RouteController[]}
   */
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
   * Get all router controllers from the controller token.
   * @private
   */
  private getAllControllers(basePath: string, token: Type<any> | any): RouteController[] {
    const store: JsonEntityStore = token.isStore ? token : getJsonEntityStore(token);
    const ctrlPath = concatPath(basePath, JsonEntityStore.from(token).path);
    const children = store.get<Type[]>("childrenControllers", []);

    return children
      .reduce<RouteController[]>((controllers, token) => {
        const childBasePath = concatPath(basePath, store.path);
        return controllers.concat(this.getAllControllers(childBasePath, token));
      }, [])
      .concat([
        {
          route: ctrlPath,
          provider: this.injector.getProvider(token) as ControllerProvider
        }
      ]);
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
