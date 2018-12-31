import {nameOf} from "@tsed/core";
import {Constant, InjectorService, Service} from "@tsed/di";
import {$log} from "ts-log-debug";
import {colorize} from "ts-log-debug/lib/layouts/utils/colorizeUtils";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {AfterRoutesInit} from "../../server/interfaces/AfterRoutesInit";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {IControllerRoute} from "../interfaces";

/**
 * `RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.
 */
@Service()
export class RouteService implements AfterRoutesInit {
  /**
   *
   */
  @Constant("logger.disableRoutesSummary", false)
  disableRoutesSummary: boolean;

  private readonly _routes: {route: string; provider: any}[] = [];

  constructor(private injectorService: InjectorService) {}

  /**
   *
   * @returns {{route: string; provider: any}[]}
   */
  get routes(): {route: string; provider: any}[] {
    return this._routes || [];
  }

  /**
   *
   */
  $afterRoutesInit() {
    if (!this.disableRoutesSummary) {
      $log.info("Routes mounted :");
      this.printRoutes($log);
    }
  }

  /**
   *
   * @returns {number}
   * @param route
   */
  addRoute(route: {route: string; provider: any}) {
    return this._routes.push(route);
  }

  /**
   * Get all routes built by TsExpressDecorators and mounted on Express application.
   * @returns {IControllerRoute[]}
   */
  getRoutes(): IControllerRoute[] {
    const routes: IControllerRoute[] = [];

    this.routes.forEach((config: {route: string; provider: ControllerProvider}) => {
      this.buildRoutes(routes, config.provider, config.route);
    });

    return routes;
  }

  /**
   * Print all route mounted in express via Annotation.
   */
  public printRoutes(logger: {info: (s: any) => void} = $log): void {
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

    logger.info("\n" + str.trim());
  }

  /**
   * Return all Routes stored in ControllerProvider manager.
   * @returns {IControllerRoute[]}
   */
  getAll(): IControllerRoute[] {
    return this.getRoutes();
  }

  /**
   *
   * @param routes
   * @param ctrl
   * @param endpointUrl
   */
  private buildRoutes(routes: any[], ctrl: ControllerProvider, endpointUrl: string) {
    // console.log("Build routes =>", ctrl.className, endpointUrl);

    ctrl.dependencies
      .map(ctrl => this.injectorService.getProvider(ctrl))
      .forEach((provider: ControllerProvider) => this.buildRoutes(routes, provider, `${endpointUrl}${provider.path}`));

    ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
      endpoint.pathsMethods.forEach(({path, method}) => {
        if (!!method) {
          const className = nameOf(ctrl.provide),
            methodClassName = endpoint.methodClassName,
            parameters = ParamRegistry.getParams(ctrl.provide, endpoint.methodClassName);

          routes.push({
            method,
            name: `${className}.${methodClassName}()`,
            url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/"),
            className,
            methodClassName,
            parameters
          });
        }
      });
    });
  }
}
