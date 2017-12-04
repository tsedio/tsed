/**
 * @module common/mvc
 */
/** */
import {Type} from "../../core/interfaces/Type";

/**
 *
 */
export interface IParamOptions<T> {
    required?: boolean;
    expression?: string | RegExp;
    useType?: Type<T>;
    baseType?: Type<T>;
    useConverter?: boolean;
    useValidation?: boolean;
}