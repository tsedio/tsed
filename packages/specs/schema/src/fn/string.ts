import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new string model.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function string(): JsonSchema {
  return from(String);
}
