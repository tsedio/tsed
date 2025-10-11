import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new boolean model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 */
export function boolean(): SchemaShape<boolean> & JsonSchema & TypedChain<boolean> {
  return from(Boolean);
}
