import type {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

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
