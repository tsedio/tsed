import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {EndpointMetadata, HandlerMetadata} from "../../mvc";
import {ControllerBuilder} from "../builder/ControllerBuilder";
import {ControllerProvider} from "../domain/ControllerProvider";
import {IRoute, IRouteController, IRouteDetails} from "../interfaces/IRoute";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformRouter} from "./PlatformRouter";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class Platform {
  readonly routers: any[];
  private _routes: IRouteController[] = [];

  constructor(
    readonly injector: InjectorService,
    readonly platformApplication: PlatformApplication,
    readonly platformHandler: PlatformHandler
  ) {}

  get app() {
    return this.platformApplication;
  }

  get routes(): IRouteController[] {
    return this._routes || [];
  }

  /**
   * Create a native metadata base on the metadata or to the given Class.
   * @param handler
   */
  public createHandler(handler: HandlerMetadata | any) {
    return this.platformHandler.createHandler(handler);
  }

  /**
   * Create routers from the collected controllers
   */
  public createRoutersFromControllers() {
    const {injector} = this;

    return injector
      .getProviders(ProviderType.CONTROLLER)
      .map(provider => {
        if (!provider.hasParent()) {
          return new ControllerBuilder(provider as ControllerProvider).build(injector);
        }
      })
      .filter(Boolean);
  }

  /**
   * Create a new instance of PlatformRouter
   * @param routerOptions
   */
  public createRouter(routerOptions: any = {}): PlatformRouter {
    return PlatformRouter.create(this.injector, routerOptions);
  }

  public addRoutes(routes: IRoute[]) {
    routes.forEach(routeSettings => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  public addRoute(endpoint: string, token: TokenProvider) {
    const {injector} = this;

    if (injector.hasProvider(token)) {
      const provider: ControllerProvider = injector.getProvider(token)! as any;
      const route = provider.getEndpointUrl(endpoint);

      if (!provider.hasParent()) {
        this._routes.push({
          route,
          provider
        });

        this.app.use(route, provider.router);
      }
    }

    return this;
  }

  /**
   * Get all routes built by TsExpressDecorators and mounted on Express application.
   * @returns {IRouteDetails[]}
   */
  public getRoutes(): IRouteDetails[] {
    let routes: IRouteDetails[] = [];

    this.routes.forEach((config: {route: string; provider: ControllerProvider}) => {
      routes = routes.concat(this.buildRoutes(config.route, config.provider));
    });

    return routes;
  }

  /**
   *
   * @param ctrl
   * @param endpointUrl
   */
  private buildRoutes(endpointUrl: string, ctrl: ControllerProvider): IRouteDetails[] {
    const {injector} = this;

    let routes: IRouteDetails[] = [];

    ctrl.children
      .map(ctrl => injector.getProvider(ctrl))
      .forEach((provider: ControllerProvider) => {
        routes = routes.concat(this.buildRoutes(`${endpointUrl}${provider.path}`, provider));
      });

    ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
      const {pathsMethods, params, targetName, propertyKey} = endpoint;

      pathsMethods.forEach(({path, method}) => {
        if (!!method) {
          routes.push({
            method,
            name: `${targetName}.${String(propertyKey)}()`,
            url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/"),
            className: targetName,
            methodClassName: String(propertyKey),
            parameters: params
          });
        }
      });
    });

    return routes;
  }
}
