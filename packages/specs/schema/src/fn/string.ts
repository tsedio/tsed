import {from} from "./from.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new string model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function string(): TypedJsonSchema<string> {
  return from(String);
}
