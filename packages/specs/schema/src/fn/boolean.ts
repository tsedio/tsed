import {from} from "./from.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new boolean model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function boolean(): TypedJsonSchema<boolean> {
  return from(Boolean);
}
