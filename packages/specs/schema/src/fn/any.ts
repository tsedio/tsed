import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {Infer} from "./types.js";

/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function any(): JsonSchema<any>;
export function any<S extends Array<JsonSchema<any>>>(...types: S): JsonSchema<{[K in keyof S]: Infer<S[K]>}>;
export function any(...types: Parameters<JsonSchema["oneOf"]>[0]) {
  return from().any(...types);
}
