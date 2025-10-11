import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {string} from "./string.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new string model with `format: email`.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * ### Example
 *
 * ```typescript
 * const schema = email();
 * // Results in: { type: "string", format: "email" }
 * ```
 */
export function email(): SchemaShape<string> & JsonSchema & TypedChain<string> {
  return string().format(JsonFormatTypes.EMAIL);
}
