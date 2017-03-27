/**
 * @module mvc
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {IParamArgs} from "./Arguments";

/**
 *
 */
export interface IInjectableParamsMetadata<T> {
    required?: boolean;
    expression?: string | RegExp;
    useType?: Type<T>;
    baseType?: Type<T>;
    useConverter?: boolean;
}

/**
 *
 */
export interface IInjectableParamSettings<T> extends IInjectableParamsMetadata<T>, IParamArgs<T> {

}