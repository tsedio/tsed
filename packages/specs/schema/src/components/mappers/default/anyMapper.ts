import {JsonLazyRef} from "../../../domain/JsonLazyRef.js";
import {JsonSchema} from "../../../domain/JsonSchema.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {defineSchemaMapper, execMapper, execOneOfMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {toRef} from "../../../utils/ref.js";

export function anyMapper(input: any, options: JsonSchemaOptions = {}): any {
  if (typeof input !== "object" || input === null) {
    return input;
  }

  if (input instanceof JsonLazyRef) {
    return execMapper("lazyRef", [input], options);
  }

  if (input instanceof JsonSchema && input.get("enum") instanceof JsonSchema) {
    const enumSchema: JsonSchema = input.get("enum")!;

    return toRef(enumSchema, enumSchema.toJSON(options), options);
  }

  if (input.$kind && input.$isJsonDocument) {
    const kind = execOneOfMapper([input.$kind, "map"], options);
    const schema = execMapper(kind, [input], options);

    return input.canRef ? toRef(input, schema, options) : schema;
  }

  return execMapper("object", [input], options);
}

defineSchemaMapper({type: "any", transform: anyMapper});
