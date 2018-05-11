import {Type} from "@tsed/core";
import {IRouterOptions} from "../../config/interfaces/IRouterOptions";
import {IControllerMiddlewares} from "./IControllerMiddlewares";
import {PathParamsType} from "./PathParamsType";

/**
 *
 */
export interface IControllerOptions {
  path?: PathParamsType;
  dependencies?: Type<any>[];
  routerOptions?: IRouterOptions;
  middlewares?: IControllerMiddlewares;
}
