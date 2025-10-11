import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {string} from "./string.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new string model with `format: uri`.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function uri(): SchemaShape<string> & JsonSchema & TypedChain<string> {
  return string().format(JsonFormatTypes.URI);
}
