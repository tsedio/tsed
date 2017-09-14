/**
 * @module common/mvc
 */
/** */
import {Type} from "../../core/interfaces";
import {IRouterOptions} from "./IRouterOptions";
import {PathParamsType} from "./PathParamsType";
import { IControllerMiddlewares } from './IControllerMiddlewares';

/**
 *
 */
export interface IControllerOptions {
    path?: PathParamsType;
    dependencies?: Type<any>[];
    scope?: boolean | "request";
    routerOptions?: IRouterOptions;
    middlewares?: IControllerMiddlewares;
}