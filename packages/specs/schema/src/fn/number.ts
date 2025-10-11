import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new number model.
 *
 * * See @@JsonSchema@@ to discover available methods.
 */
export function number(): SchemaShape<number> & JsonSchema & TypedChain<number> {
  return from(Number);
}
