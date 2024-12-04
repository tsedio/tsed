import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new string model with `format: email`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 */
export function email(): JsonSchema {
  return from(String).format(JsonFormatTypes.EMAIL);
}
