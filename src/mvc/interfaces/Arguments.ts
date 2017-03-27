/**
 * @module mvc
 */ /** */

import {Type} from "../../core/interfaces/Type";
/**
 *
 */
export interface IClassArgs<T> {
    target: Type<T>;
}

/**
 *
 */
export interface IMethodArgs<T> extends IClassArgs<T> {
    propertyKey: string | symbol;
}

/**
 *
 */
export interface IAttributArgs<T> extends IClassArgs<T> {
    propertyKey: string | symbol;
}

/**
 *
 */
export interface IParamArgs<T> extends IMethodArgs<T> {
    parameterIndex: number;
}