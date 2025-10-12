import {from} from "./from.js";

/**
 * Declare a new number model.
 *
 * * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function number() {
  return from(Number);
}
