import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {string} from "./string.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new string model with `format: uri`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function uri(): TypedJsonSchema<string> {
  return string().format(JsonFormatTypes.URI);
}
