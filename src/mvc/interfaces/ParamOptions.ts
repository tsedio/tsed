/**
 * @module mvc
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {IParamArgs} from "./Arguments";

/**
 *
 */
export interface IParamOptions<T> {
    required?: boolean;
    expression?: string | RegExp;
    useType?: Type<T>;
    baseType?: Type<T>;
    useConverter?: boolean;
}

/**
 *
 */
export interface IInjectableParamSettings<T> extends IParamOptions<T>, IParamArgs<T> {

}