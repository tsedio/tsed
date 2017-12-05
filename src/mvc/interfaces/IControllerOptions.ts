import {IRouterOptions} from "../../config/interfaces/IRouterOptions";
/**
 * @module common/mvc
 */
/** */
import {Type} from "../../core/interfaces";
import {ProviderScope} from "../../di/interfaces";
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