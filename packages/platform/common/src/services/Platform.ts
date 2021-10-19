import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {PlatformControllerBuilder} from "../builder/PlatformControllerBuilder";
import {ControllerProvider, EndpointMetadata, PlatformRouteDetails} from "../domain";
import {Route, RouteController} from "../interfaces/Route";
import {getControllerPath} from "../utils/getControllerPath";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformRouter} from "./PlatformRouter";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
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

  protected $onInit() {
    this.buildControllers();
  }

  public addRoutes(routes: Route[]) {
    routes.forEach((routeSettings) => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  public addRoute(endpoint: string, token: TokenProvider) {
    const {injector} = this;

    if (injector.hasProvider(token)) {
      const provider: ControllerProvider = injector.getProvider(token)! as any;

      if (provider.type === ProviderType.CONTROLLER) {
        const route = getControllerPath(endpoint, provider);
        if (!provider.hasParent()) {
          const routes = this.buildRoutes(route, provider);

          this._routes.push(...routes);
          this._controllers.push({
            route,
            provider
          });

          this.app.use(route, ...[].concat(provider.getRouter().callback()));
        }
      }
    }

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

  /**
   * Create routers from the collected controllers.
   * @private
   */
  private createRouters() {
    const {injector} = this;

    injector.getProviders(ProviderType.CONTROLLER).map((provider: ControllerProvider) => {
      provider.setRouter(PlatformRouter.create(injector, provider.routerOptions));
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
        return new PlatformControllerBuilder(provider as ControllerProvider).build(injector);
      }
    });
  }

  /**
   *
   * @param ctrl
   * @param endpointUrl
   */
  private buildRoutes(endpointUrl: string, ctrl: ControllerProvider): PlatformRouteDetails[] {
    const {injector} = this;

    let routes: PlatformRouteDetails[] = [];

    routes = ctrl.children
      .map((ctrl) => injector.getProvider(ctrl))
      .reduce((routes: PlatformRouteDetails[], provider: ControllerProvider) => {
        return routes.concat(this.buildRoutes(`${endpointUrl}${provider.path}`, provider));
      }, routes);

    ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
      endpoint.operationPaths.forEach(({path, method}) => {
        if (method) {
          routes.push(
            new PlatformRouteDetails({
              provider: ctrl,
              endpoint,
              method,
              url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/")
            })
          );
        }
      });
    });

    return routes;
  }
}
