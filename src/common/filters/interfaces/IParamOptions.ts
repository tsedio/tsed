import {Type} from "@tsed/core";

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
