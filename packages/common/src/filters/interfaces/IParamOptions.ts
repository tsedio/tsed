import {Type} from "@tsed/core";
import {ParamTypes} from "./ParamTypes";

/**
 *
 */
export interface IParamOptions<T> {
  required?: boolean;
  expression?: string;
  useType?: Type<T>;
  baseType?: Type<T>;
  useConverter?: boolean;
  useValidation?: boolean;
  paramType?: ParamTypes;
}
