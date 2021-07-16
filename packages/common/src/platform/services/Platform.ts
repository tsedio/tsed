import {Injectable, InjectorService, ProviderScope, ProviderType, TokenProvider} from "@tsed/di";
import {PlatformControllerBuilder} from "../builder/PlatformControllerBuilder";
import {ControllerProvider} from "../domain/ControllerProvider";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails";
import {Route, RouteController} from "../interfaces/Route";
import {getControllerPath} from "../utils/getControllerPath";
import {PlatformApplication} from "./PlatformApplication";

const SUPPORTED_METHODS = ["all", "get", "post", "put", "patch", "delete", "head", "options"];
/**
 * `Platform` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class Platform {
  #controllers: RouteController[] = [];

  constructor(readonly injector: InjectorService, readonly platformApplication: PlatformApplication) {}

  get app() {
    return this.platformApplication;
  }

  get routes(): PlatformRouteDetails[] {
    return this.getRoutes();
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
        if (!provider.hasParent()) {
          const router = new PlatformControllerBuilder(provider).build(injector);
          const route = getControllerPath(route, provider);

          this.app.use(route, router);

          this.#controllers.push({
            route,
            provider
          });
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
    return this.app
      .getStacks()
      .filter((stack) => {
        return SUPPORTED_METHODS.includes(stack.method) && stack.provider && stack.endpoint;
      })
      .map(({method, path, provider, endpoint}: any) => {
        return new PlatformRouteDetails({
          method,
          url: path,
          provider,
          endpoint
        });
      });
  }

  public getMountedControllers(): RouteController[] {
    return this.#controllers;
  }
}
