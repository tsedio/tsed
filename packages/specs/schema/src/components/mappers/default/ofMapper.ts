import type {JsonSchema} from "../../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../../interfaces/JsonSchemaOptions.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";

export function ofMapper(input: (any | JsonSchema)[], options: JsonSchemaOptions) {
  return input.map((value: any | JsonSchema) => {
    return execMapper("item", [value], options);
  });
}

defineSchemaMapper({type: "anyOf", transform: ofMapper});
defineSchemaMapper({type: "allOf", transform: ofMapper});
defineSchemaMapper({type: "oneOf", transform: ofMapper});
