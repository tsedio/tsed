import {Type} from "@tsed/core";
import {MiddlewareType} from "./MiddlewareType";

/**
 *
 */
export interface IMiddlewareOptions {
    useClass?: Type<any>;
    type?: MiddlewareType;
}