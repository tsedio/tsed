import {from} from "./from.js";

/**
 * Declare a new integer model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @returns A schema configured for integer values
 * @schemaFunctional
 */
export function integer() {
  return from(Number).integer();
}
