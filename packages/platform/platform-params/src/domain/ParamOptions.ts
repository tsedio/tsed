import {Type} from "@tsed/core";

export interface ParamOptions<T = any> {
  dataPath: string;
  paramType: string;
  expression?: string;
  useType?: Type<T>;
  useMapper?: boolean;
  /**
   * @deprecated Since 10-2022. Use ParamOptions.useMapper.
   */
  useConverter?: boolean;
  useValidation?: boolean;

  [key: string]: any;
}
