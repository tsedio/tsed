import {Type} from "@tsed/core";
import {PathType} from "@tsed/di";

/**
 * @ignore
 */
export interface PlatformRouteOptions {
  token?: Type<any>;
  path?: PathType | undefined;
  method?: string;
  handlers: any[];
}

/**
 * @ignore
 */
export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;
