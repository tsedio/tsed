import {PathParamsType} from "../../mvc";

/**
 * @ignore
 */
export interface PlatformRouteOptions {
  method: string;
  path: PathParamsType;
  handlers: any[];
  isFinal?: boolean;
}

/**
 * @ignore
 */
export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;

/**
 * @ignore
 */
export interface PlatformRouterMethods<T = any> {
  addRoute(routeOptions: PlatformRouteOptions): this;

  use(...handlers: any[]): this;

  callback(): any;

  getRouter(): T;
}
