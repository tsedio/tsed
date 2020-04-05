import {Injectable, TokenProvider} from "@tsed/di";
import {IRoute, IRouteController, IRouteDetails} from "../interfaces/IRoute";
import {Platform} from "./Platform";

/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 * @deprecated Use Platform instead
 */
@Injectable()
export class RouteService {
  constructor(private platform: Platform) {}

  get routes(): IRouteController[] {
    return this.platform.routes;
  }

  public addRoutes(routes: IRoute[]) {
    return this.platform.addRoutes(routes);
  }

  /**
   * Add a new route in the route registry
   * @param endpoint
   * @param token
   */
  public addRoute(endpoint: string, token: TokenProvider) {
    return this.platform.addRoute(endpoint, token);
  }

  /**
   * Get all routes built by TsExpressDecorators and mounted on Express application.
   * @returns {IRouteDetails[]}
   */
  public getRoutes(): IRouteDetails[] {
    return this.platform.getRoutes();
  }

  /**
   * @deprecated Use getRoutes instead of
   */
  public getAll() {
    return this.getRoutes();
  }
}
