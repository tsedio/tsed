import {JsonSchema} from "../domain/JsonSchema.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

/**
 * Resolve generic bindings for the current compilation.
 *
 * Local generics attached to the `JsonSchema` instance take precedence over the
 * externally provided `options.generics` bindings.
 */
export function getGenerics(value: JsonSchema, options: JsonSchemaOptions) {
  return value.getGenericOf() ?? options.generics;
}

/**
 * Resolve generic bindings and the mapper strategy associated with their
 * origin.
 */
export function getGenericsOptions(value: JsonSchema, options: JsonSchemaOptions) {
  const generics = getGenerics(value, options);

  return {generics, mapper: value.getGenericOf() ? "schema" : "class"};
}
