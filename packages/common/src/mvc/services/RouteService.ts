import {InjectorService, Service, TokenProvider} from "@tsed/di";
import {ExpressApplication} from "../../server/decorators/expressApplication";
import {ControllerProvider} from "../models/ControllerProvider";
import {EndpointMetadata} from "../models/EndpointMetadata";

export interface IRoute {
  route: string;
  token: TokenProvider;
}

export interface IRouteController {
  route: string;
  provider: ControllerProvider;
}

export interface IRouteDetails {
  method: string;
  name: string;
  url: string;
  className: string;
  methodClassName: string;
  parameters: any;
  returnType?: any;
}

/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 */
@Service()
export class RouteService {
  private readonly _routes: IRouteController[] = [];

  constructor(private injector: InjectorService, @ExpressApplication private expressApplication: ExpressApplication) {}

  get routes(): IRouteController[] {
    return this._routes || [];
  }

  public addRoutes(routes: IRoute[]) {
    routes.forEach(routeSettings => {
      this.addRoute(routeSettings.route, routeSettings.token);
    });
  }

  /**
   * Add a new route in the route registry
   * @param endpoint
   * @param token
   */
  public addRoute(endpoint: string, token: TokenProvider) {
    if (this.injector.hasProvider(token)) {
      const provider: ControllerProvider = this.injector.getProvider(token)! as any;
      const route = provider.getEndpointUrl(endpoint);

      if (!provider.hasParent()) {
        this._routes.push({
          route,
          provider
        });
        this.expressApplication.use(route, provider.router);
      }
    }

    return this;
  }

  /**
   * Get all routes built by TsExpressDecorators and mounted on Express application.
   * @returns {IControllerRoute[]}
   */
  public getRoutes(): IRouteDetails[] {
    let routes: IRouteDetails[] = [];

    this.routes.forEach((config: {route: string; provider: ControllerProvider}) => {
      routes = routes.concat(this.buildRoutes(config.route, config.provider));
    });

    return routes;
  }

  /**
   * @deprecated Use getRoutes instead of
   */
  public getAll() {
    return this.getRoutes();
  }

  /**
   *
   * @param ctrl
   * @param endpointUrl
   */
  private buildRoutes(endpointUrl: string, ctrl: ControllerProvider): IRouteDetails[] {
    let routes: IRouteDetails[] = [];

    ctrl.children
      .map(ctrl => this.injector.getProvider(ctrl))
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
