import {ParamTypes, UseParam} from "@tsed/common";
import {mapParamsOptions} from "@tsed/common";

export function BodyParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useConverter = true, useValidation = true} = mapParamsOptions(args);

  return UseParam(
    {
      paramType: ParamTypes.BODY,
      dataPath: "$ctx.request.body",
      expression,
      useType,
      useConverter,
      useValidation
    });
}
