import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import type {JsonSchema} from "../../domain/JsonSchema";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";

export function propertiesMapper(input: any | JsonSchema, options: JsonSchemaOptions, parent: JsonSchema) {
  if (input.isClass) {
    return execMapper("class", [input], options);
  }

  return execMapper("any", [input], {
    ...options,
    genericLabels: parent.genericLabels
  });
}

registerJsonSchemaMapper("properties", propertiesMapper);
registerJsonSchemaMapper("items", propertiesMapper);
registerJsonSchemaMapper("additionalProperties", propertiesMapper);
registerJsonSchemaMapper("propertyNames", propertiesMapper);
registerJsonSchemaMapper("contains", propertiesMapper);
registerJsonSchemaMapper("dependencies", propertiesMapper);
registerJsonSchemaMapper("patternProperties", propertiesMapper);
registerJsonSchemaMapper("additionalItems", propertiesMapper);
registerJsonSchemaMapper("not", propertiesMapper);
registerJsonSchemaMapper("definitions", propertiesMapper);
