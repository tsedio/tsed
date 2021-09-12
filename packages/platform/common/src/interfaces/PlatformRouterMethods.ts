import type {PlatformRouteOptions} from "./PlatformRouteOptions";

/**
 * @ignore
 */
export interface PlatformRouterMethods<T = any> {
  addRoute(routeOptions: PlatformRouteOptions): this;

  use(...handlers: any[]): this;

  callback(): any;

  getRouter(): T;
}
