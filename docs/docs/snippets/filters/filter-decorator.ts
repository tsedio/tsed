import {IParamOptions, ParamTypes, UseFilter} from "@tsed/common";
import {CustomBodyParamFilter} from "./CustomBodyParamFilter";

export function CustomBodyParams(options: IParamOptions<any> = {}): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = options;

  return UseFilter(CustomBodyParamFilter, {
    expression,
    useType,
    useConverter,
    useValidation,
    paramType: ParamTypes.BODY // for swagger
  });
}
