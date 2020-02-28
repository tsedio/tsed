import {applyDecorators, Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {ParamFn} from "./paramFn";
import {UseDeserialization} from "./useDeserialization";
import {UseParamExpression} from "./useParamExpression";
import {UseParamType} from "./useParamType";
import {UseType} from "./useType";
import {UseValidation} from "./useValidation";

/**
 * Register a new param filter
 * @param token
 * @param options
 * @constructor
 */
export function UseFilter(token: Type<any> | ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  let filter: any;
  if (typeof token === "string") {
    options.paramType = token;
  } else {
    filter = token;
  }

  return applyDecorators(
    filter &&
      ParamFn(param => {
        param.filter = filter;
      }),
    options.paramType && UseParamType(options.paramType),
    options.useType && UseType(options.useType),
    options.expression && UseParamExpression(options.expression),
    options.useValidation && UseValidation(),
    options.useConverter && UseDeserialization()
  ) as ParameterDecorator;
}
