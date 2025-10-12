import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {string} from "./string.js";

/**
 * Declare a new string model with `format: url`.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function url() {
  return string().format(JsonFormatTypes.URL);
}
