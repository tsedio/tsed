import {from} from "./from.js";

/**
 * Declare a new boolean model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function boolean() {
  return from(Boolean);
}
