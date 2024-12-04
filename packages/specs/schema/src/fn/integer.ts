import {from} from "./from.js";

/**
 * Declare a new integer model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @function
 */
export function integer() {
  return from(Number).integer();
}
