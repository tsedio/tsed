import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {string} from "./string.js";
import type {TypedJsonSchema} from "./types.js";

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
 *
 * @schemaFunctional
 */
export function email(): TypedJsonSchema<string> {
  return string().format(JsonFormatTypes.EMAIL);
}
