import {Constant, InjectorService, IProvider, Service, TokenProvider} from "@tsed/di";
import {$log} from "ts-log-debug";
import {colorize} from "ts-log-debug/lib/layouts/utils/colorizeUtils";
import {AfterRoutesInit} from "../../server/interfaces/AfterRoutesInit";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {ExpressApplication} from "../decorators/class/expressApplication";
import {IControllerRoute} from "../interfaces";

export interface IRouteProvider {
  route: string;
  provider: ControllerProvider;
}

/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 */
@Service()
export class RouteService implements AfterRoutesInit {
  /**
   *
   */
  @Constant("logger.disableRoutesSummary", false)
  disableRoutesSummary: boolean;

  private readonly _routes: IRouteProvider[] = [];

  constructor(private injector: InjectorService, @ExpressApplication private expressApplication: ExpressApplication) {
  }

  get routes(): IRouteProvider[] {
    return this._routes || [];
  }

  public $onRoutesInit() {
    $log.info("Map controllers");
    const providers: IProvider<any>[] = this.injector.settings.get("routes") || [];

    providers.forEach(provider => {
      this.addRoute(provider.endpoint, provider.provide);
    });
  }

  /**
   *
   */
  public $afterRoutesInit() {
    if (!this.disableRoutesSummary) {
      this.injector.logger.info("Routes mounted :");
      this.printRoutes();
    }
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
  public getRoutes(): IControllerRoute[] {
    let routes: IControllerRoute[] = [];

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
   * Print all route mounted in express via Annotation.
   */
  public printRoutes(): void {
    const mapColor: {[key: string]: string} = {
      GET: "green",
      POST: "yellow",
      PUT: "blue",
      DELETE: "red",
      PATCH: "magenta",
      ALL: "cyan"
    };

    const routes = this.getRoutes().map(route => {
      const method = route.method.toUpperCase();

      route.method = {
        length: method.length,
        toString: () => {
          return colorize(method, mapColor[method]);
        }
      } as any;

      return route;
    });

    const str = $log.drawTable(routes, {
      padding: 1,
      header: {
        method: "Method",
        url: "Endpoint",
        name: "Class method"
      }
    });

    this.injector.logger.info("\n" + str.trim());
  }

  /**
   *
   * @param ctrl
   * @param endpointUrl
   */
  private buildRoutes(endpointUrl: string, ctrl: ControllerProvider): IControllerRoute[] {
    // console.log("Build routes =>", ctrl.className, endpointUrl);
    let routes: IControllerRoute[] = [];

    ctrl.children
      .map(ctrl => this.injector.getProvider(ctrl))
      .forEach((provider: ControllerProvider) => {
        routes = routes.concat(this.buildRoutes(`${endpointUrl}${provider.path}`, provider));
      });

    ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
      const {pathsMethods, params, targetName, methodClassName} = endpoint;

      pathsMethods.forEach(({path, method}) => {
        if (!!method) {
          const config = {
            method,
            name: `${targetName}.${String(methodClassName)}()`,
            url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/"),
            className: targetName,
            methodClassName,
            parameters: params
          };

          routes.push(config);
        }
      });
    });

    return routes;
  }
}
