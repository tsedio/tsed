import type {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function ofMapper(input: (any | JsonSchema)[], options: JsonSchemaOptions, parent: JsonSchema) {
  return input.map((value: any | JsonSchema) => {
    return execMapper("item", [value], options);
  });
}

registerJsonSchemaMapper("anyOf", ofMapper);
registerJsonSchemaMapper("allOf", ofMapper);
registerJsonSchemaMapper("oneOf", ofMapper);
