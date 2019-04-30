import {Type} from "@tsed/core";
import {IProvider} from "@tsed/di";
import {IRouterSettings} from "../../config/interfaces/IServerSettings";
import {IControllerMiddlewares} from "./IControllerMiddlewares";
import {PathParamsType} from "./PathParamsType";

/**
 *
 */
export interface IControllerProvider extends Partial<IProvider<any>> {
  path?: PathParamsType;
  dependencies?: Type<any>[];
  routerOptions?: IRouterSettings;
  middlewares?: IControllerMiddlewares;
}
