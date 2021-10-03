import {PathType} from "@tsed/di";

/**
 * @ignore
 */
export interface PlatformRouteOptions {
  method: string;
  path: PathType;
  handlers: any[];
  isFinal?: boolean;
}

/**
 * @ignore
 */
export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;
