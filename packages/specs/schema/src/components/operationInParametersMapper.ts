import {JsonParameter} from "../domain/JsonParameter";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";

export function operationInParametersMapper(parameters: JsonParameter[], options: JsonSchemaOptions) {
  return parameters.flatMap((parameter) => execMapper("operationInParameter", parameter, options)).filter(Boolean);
}

registerJsonSchemaMapper("operationInParameters", operationInParametersMapper);
