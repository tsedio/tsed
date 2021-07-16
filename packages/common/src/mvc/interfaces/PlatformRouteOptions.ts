import {PlatformStaticsOptions} from "../../config/interfaces/PlatformStaticsSettings";
import {ControllerProvider} from "../../platform/domain/ControllerProvider";
import {PlatformRouter} from "../../platform/services/PlatformRouter";
import {EndpointMetadata} from "../models/EndpointMetadata";
import {PathParamsType} from "./PathParamsType";

export interface PlatformRouteStackBase extends Record<string, any> {
  method: string;
  path?: PathParamsType;
  isFinal?: boolean;
  endpoint?: EndpointMetadata;
  provider?: ControllerProvider;
  handlers: any[];
}

export interface PlatformStackRouter extends PlatformRouteStackBase {
  method: "router";
  router: PlatformRouter;
}

export interface PlatformStackStatics extends PlatformRouteStackBase {
  method: "statics";
  path: PathParamsType;
  options: PlatformStaticsOptions;
}

export interface PlatformStackUse extends PlatformRouteStackBase {
  method: "use";
}

export interface PlatformStackWithMethod extends PlatformRouteStackBase {
  method: "get" | "post" | "put" | "patch" | "delete" | "head" | "options" | "all";
  path: PathParamsType;
}

/**
 * @ignore
 */
export type PlatformRouteStack = PlatformStackUse | PlatformStackRouter | PlatformStackWithMethod | PlatformStackStatics;
/**
 * @ignore
 */
export type PlatformRouteOptions = PlatformRouteStack;
/**
 * @ignore
 */
export type PlatformRouteWithoutHandlers = Partial<Omit<PlatformRouteOptions, "handlers">>;
