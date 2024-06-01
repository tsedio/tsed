import {JsonParameter} from "../../domain/JsonParameter.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function operationInParametersMapper(parameters: JsonParameter[], options: JsonSchemaOptions) {
  return parameters.flatMap((parameter) => execMapper("operationInParameter", [parameter], options)).filter(Boolean);
}

registerJsonSchemaMapper("operationInParameters", operationInParametersMapper);
