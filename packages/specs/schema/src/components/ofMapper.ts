import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import type {JsonSchema} from "../domain/JsonSchema";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";

export function ofMapper(input: (any | JsonSchema)[], options: JsonSchemaOptions, parent: JsonSchema) {
  return input.map((value: any | JsonSchema) => {
    return execMapper("item", value, {
      ...options,
      genericLabels: parent.genericLabels
    });
  });
}

registerJsonSchemaMapper("anyOf", ofMapper);
registerJsonSchemaMapper("allOf", ofMapper);
registerJsonSchemaMapper("oneOf", ofMapper);
