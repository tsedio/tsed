import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new boolean model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 */
export function boolean(): JsonSchema {
  return from(Boolean);
}
