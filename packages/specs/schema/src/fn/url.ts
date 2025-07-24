import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {string} from "./string.js";

/**
 * Declare a new string model with `format: url`.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function url(): JsonSchema {
  return string().format(JsonFormatTypes.URL);
}
