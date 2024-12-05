import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
/**
 * Declare a new integer model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @returns {JsonSchema} A schema configured for integer values
 * @function
 */
export function integer(): JsonSchema {
  return from(Number).integer();
}
