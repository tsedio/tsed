/**
 * @module di
 */
/** */
import {Type} from "../../core";
/**
 *
 */
export interface IInjectableMethod<T> {
    target?: Type<T>;
    methodName?: string;
    designParamTypes?: any[];
    locals?: Map<Function, any>;
}