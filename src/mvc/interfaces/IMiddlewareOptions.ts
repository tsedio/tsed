/**
 * @module common/mvc
 */
/** */
import {Type} from "../../core/interfaces";
import {MiddlewareType} from "./MiddlewareType";
/**
 *
 */
export interface IMiddlewareOptions {
    useClass?: Type<any>;
    type?: MiddlewareType;
}