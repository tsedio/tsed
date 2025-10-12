import {from} from "./from.js";

/**
 * Declare a new string model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function string() {
  return from(String);
}
