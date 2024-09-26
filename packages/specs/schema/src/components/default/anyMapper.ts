import {JsonLazyRef} from "../../domain/JsonLazyRef.js";
import {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, oneOfMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {mapGenericsOptions} from "../../utils/generics.js";
import {toRef} from "../../utils/ref.js";

export function anyMapper(input: any, options: JsonSchemaOptions = {}): any {
  if (typeof input !== "object" || input === null) {
    return input;
  }

  if (input instanceof JsonLazyRef) {
    return execMapper("lazyRef", [input], options);
  }

  if (input instanceof JsonSchema && input.get("enum") instanceof JsonSchema) {
    const enumSchema: JsonSchema = input.get("enum");

    return toRef(enumSchema, enumSchema.toJSON(options), options);
  }

  if (input.$kind && input.$isJsonDocument) {
    const kind = oneOfMapper([input.$kind, "map"], options);
    const schema = execMapper(kind, [input], mapGenericsOptions(options));

    return input.canRef ? toRef(input, schema, options) : schema;
  }

  return execMapper("object", [input], options);
}

registerJsonSchemaMapper("any", anyMapper);
