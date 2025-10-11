import {from} from "./from.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new number model.
 *
 * * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function number(): TypedJsonSchema<number> {
  return from(Number);
}
