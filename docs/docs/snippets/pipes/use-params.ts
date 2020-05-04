import {
  IParamOptions,
  ParamTypes,
  UseDeserialization,
  UseParamExpression,
  UseParamType,
  UseValidation
} from "@tsed/common";
import {UseType} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

export function UseParam(paramType: ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  return applyDecorators(
    UseParamType(paramType),
    options.useType && UseType(options.useType),
    options.expression && UseParamExpression(options.expression),
    options.useValidation && UseValidation(),
    options.useConverter && UseDeserialization()
  ) as ParameterDecorator;
}
