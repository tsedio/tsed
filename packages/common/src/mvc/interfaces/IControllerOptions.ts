import {Type} from "@tsed/core";
import {IRouterSettings} from "../../config/interfaces/IServerSettings";
import {IControllerMiddlewares} from "./IControllerMiddlewares";
import {PathParamsType} from "./PathParamsType";

/**
 *
 */
export interface IControllerOptions {
  path?: PathParamsType;
  dependencies?: Type<any>[];
  routerOptions?: IRouterSettings;
  middlewares?: IControllerMiddlewares;
}
