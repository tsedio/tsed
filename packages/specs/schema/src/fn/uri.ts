import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {string} from "./string.js";

/**
 * Declare a new string model with `format: uri`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function uri() {
  return string().format(JsonFormatTypes.URI);
}
