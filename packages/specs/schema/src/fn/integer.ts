import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";
/**
 * Declare a new integer model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @returns {JsonSchema} A schema configured for integer values
 * @function
 */
export function integer(): SchemaShape<number> & JsonSchema & TypedChain<number> {
  return from(Number).integer();
}
