import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {EndpointMetadata} from "../../mvc";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails";
import {Route, RouteController} from "../interfaces/Route";
import {getControllerPath} from "../utils/getControllerPath";
import {PlatformApplication} from "./PlatformApplication";

/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class Platform {
  #routes: PlatformRouteDetails[] = [];
  #controllers: RouteController[] = [];

  constructor(readonly injector: InjectorService, readonly platformApplication: PlatformApplication) {}

  get app() {
    return this.platformApplication;
  }

  get routes(): PlatformRouteDetails[] {
    return this.#routes;
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
          const routes = this.buildRoutes(endpoint, provider);

          this.#routes.push(...routes);
          this.#controllers.push({
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
    return this.#routes;
  }

  public getMountedControllers(): RouteController[] {
    return this.#controllers;
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
