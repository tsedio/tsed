import {PathParamsType} from "../../mvc";

export interface PlatformRouteOptions {
  method: string;
  path: PathParamsType;
  handlers: any[];
  isFinal?: boolean;
}

export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;

export interface PlatformRouterMethods<T = any> {
  addRoute(routeOptions: PlatformRouteOptions): this;

  use(...handlers: any[]): this;

  callback(): any;
  getRouter(): T;
}
