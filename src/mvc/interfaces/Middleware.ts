/**
 * @module mvc
 */ /** */

import {IProvider} from "../../di/interfaces/Provider";
/**
 *
 */
export enum MiddlewareType {
    ERROR,
    MIDDLEWARE
}
/**
 *
 */
export interface IMiddleware {
    use?: Function;
}
/**
 *
 */
export interface IMiddlewareError {
    use?: Function;
}


/**
 *
 */
export interface IInjectableMiddlewareMethod {
    target: any;
    methodName: string;
    length: number;
    type: MiddlewareType;
    handler: () => Function;
    injectable: boolean;
    hasNextFn: boolean;
}

/**
 *
 */
export interface IMiddlewareProvider<T extends IMiddleware> extends IProvider<T> {
    type: MiddlewareType;
}