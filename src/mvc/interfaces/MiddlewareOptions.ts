/**
 * @module mvc
 */
/** */
import {Type} from "../../core/interfaces";
import {MiddlewareType} from "./Middleware";
/**
 *
 */
export interface IMiddlewareOptions {
    useClass?: Type<any>;
    type?: MiddlewareType;
}