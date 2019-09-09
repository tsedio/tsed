import {Type} from "@tsed/core";
import {IProvider} from "@tsed/di";
import {IRouterSettings} from "../../config/interfaces";
import {IControllerMiddlewares} from "./IControllerMiddlewares";
import {PathParamsType} from "./PathParamsType";

/**
 *
 */
export interface IControllerProvider extends Partial<IProvider<any>> {
  path?: PathParamsType;
  /**
   * @deprecated
   */
  dependencies?: Type<any>[];
  children?: Type<any>[];
  routerOptions?: IRouterSettings;
  middlewares?: Partial<IControllerMiddlewares>;
}
