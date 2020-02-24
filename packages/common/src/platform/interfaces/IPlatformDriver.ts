import {PathParamsType} from "../../mvc";

export interface IPlatformRouteOptions {
  method: string;
  path: PathParamsType;
  handlers: any[];
}

export interface IPlatformDriver<T = any> {
  raw: T;

  addRoute(routeOptions: IPlatformRouteOptions): this;

  use(...handlers: any[]): this;
}
