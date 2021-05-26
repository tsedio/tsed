import {
  IParamOptions,
  ParamTypes,
  UseDeserialization,
  UseParamExpression,
  UseParamType,
  UseType,
  UseValidation
} from "@tsed/common";
import {useDecorators} from "@tsed/core";

export function UseParam(paramType: ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  return useDecorators(
    UseParamType(paramType),
    options.useType && UseType(options.useType),
    options.expression && UseParamExpression(options.expression),
    options.useValidation && UseValidation(),
    options.useConverter && UseDeserialization()
  ) as ParameterDecorator;
}
