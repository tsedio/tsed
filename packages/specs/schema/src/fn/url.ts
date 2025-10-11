import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {string} from "./string.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new string model with `format: url`.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function url(): SchemaShape<string> & JsonSchema & TypedChain<string> {
  return string().format(JsonFormatTypes.URL);
}
