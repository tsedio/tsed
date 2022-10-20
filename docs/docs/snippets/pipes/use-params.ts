import {ParamOptions, UseDeserialization, UseParamType, UseType, UseValidation} from "@tsed/platform-params";
import {useDecorators} from "@tsed/core";

export function UseParam(options: ParamOptions<any>): ParameterDecorator {
  return useDecorators(
    UseParamType(options),
    options.useType && UseType(options.useType),
    options.useValidation && UseValidation(),
    options.useMapper && UseDeserialization()
  ) as ParameterDecorator;
}
