import type {AnyJsonSchema, JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function any(...types: AnyJsonSchema[]): JsonSchema {
  return from().any(...types);
}
