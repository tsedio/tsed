import {Type} from "@tsed/core";
import {ParamTypes} from "../models/ParamTypes";

export interface IParamOptions<T> {
  required?: boolean;
  expression?: string;
  useType?: Type<T>;
  useConverter?: boolean;
  useValidation?: boolean;
  paramType?: ParamTypes | string;
}
