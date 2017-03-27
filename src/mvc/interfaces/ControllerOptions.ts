/**
 * @module mvc
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {PathParamsType} from "./PathParamsType";

export interface IRouterOptions {
    caseSensitive?: boolean;
    mergeParams?: boolean;
    strict?: boolean;
}
/**
 *
 */
export interface IControllerOptions {
    path?: PathParamsType;
    dependencies?: Type<any>[];
    scope?: boolean | "request";
    routerOptions?: IRouterOptions;
}