import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {Infer, SchemaShape, TypedJsonSchema} from "./types.js";

/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function any(): TypedJsonSchema<any>;
export function any<S extends Array<SchemaShape<any>>>(...types: S): TypedJsonSchema<{[K in keyof S]: Infer<S[K]>}>;
export function any(...types: Parameters<JsonSchema["oneOf"]>[0]): JsonSchema {
  return from().any(...types);
}
