import {PathParamsType} from "../../mvc";

export interface PlatformRouteOptions {
  method: string;
  path: PathParamsType;
  handlers: any[];
}

export interface PlatformRouterMethods<T = any> {
  addRoute(routeOptions: PlatformRouteOptions): this;

  use(...handlers: any[]): this;

  callback(): any;
  getRouter(): T;
}
