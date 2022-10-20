import {mapParamsOptions, ParamTypes, UseParam} from "@tsed/platform-params";

export function BodyParams(...args: any[]): ParameterDecorator {
  const {expression, useType, useMapper = true, useValidation = true} = mapParamsOptions(args);

  return UseParam({
    paramType: ParamTypes.BODY,
    dataPath: "$ctx.request.body",
    expression,
    useType,
    useMapper,
    useValidation
  });
}
