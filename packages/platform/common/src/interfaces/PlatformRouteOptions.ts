import {Type} from "@tsed/core";
import {PathType} from "./PathType";

/**
 * @ignore
 */
export interface PlatformRouteOptions {
  token?: Type<any>;
  path?: PathType | undefined;
  method?: string;
  isFinal?: boolean;
  handlers: any[];
}

/**
 * @ignore
 */
export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;
