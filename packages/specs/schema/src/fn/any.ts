import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 * See @@JsonSchema@@ to discover available methods.
 */
import type {Infer, SchemaShape} from "./types.js";

export function any(): SchemaShape<any> & JsonSchema;
export function any<S extends Array<SchemaShape<any>>>(...types: S): SchemaShape<{[K in keyof S]: Infer<S[K]>}> & JsonSchema;
export function any(...types: Parameters<JsonSchema["oneOf"]>[0]): JsonSchema {
  return from().any(...types);
}
