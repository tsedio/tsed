import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new string model with `format: uri`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function uri(): JsonSchema {
  return from(String).format(JsonFormatTypes.URI);
}
