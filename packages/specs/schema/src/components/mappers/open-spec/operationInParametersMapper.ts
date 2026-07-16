import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {JsonParameter} from "../../../domain/JsonParameter.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";

export function operationInParametersMapper(parameters: JsonParameter[], options: JsonSchemaOptions) {
  return parameters.flatMap((parameter) => execMapper("operationInParameter", [parameter], options)).filter(Boolean);
}

defineSchemaMapper({type: "operationInParameters", transform: operationInParametersMapper});
