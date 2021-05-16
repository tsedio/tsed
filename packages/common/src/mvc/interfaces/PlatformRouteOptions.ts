import {PathParamsType} from "./PathParamsType";

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
