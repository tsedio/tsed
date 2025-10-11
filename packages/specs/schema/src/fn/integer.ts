import {from} from "./from.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new integer model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @returns {JsonSchema} A schema configured for integer values
 * @schemaFunctional
 */
export function integer(): TypedJsonSchema<number> {
  return from(Number).integer();
}
