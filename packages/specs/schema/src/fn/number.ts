import {from} from "./from.js";

/**
 * Declare a new number model.
 *
 * * See @@JsonSchema@@ to discover available methods.
 */
export function number() {
  return from(Number);
}
