import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new string model.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function string(): SchemaShape<string> & JsonSchema & TypedChain<string> {
  return from(String);
}
