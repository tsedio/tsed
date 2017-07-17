/**
 * @module common/mvc
 */
/** */
import {IProvider} from "../../di/interfaces";
import {IMiddleware} from "./IMiddleware";
import {MiddlewareType} from "./MiddlewareType";
/**
 *
 */
export interface IMiddlewareProvider<T extends IMiddleware> extends IProvider<T> {
    type: MiddlewareType;
}