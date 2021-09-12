import {Type} from "@tsed/core";

export interface ParamOptions<T = any> {
  dataPath: string;
  paramType: string;
  expression?: string;
  useType?: Type<T>;
  useConverter?: boolean;
  useValidation?: boolean;

  [key: string]: any;
}
