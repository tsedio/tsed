import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a model with any type (By default: `integer`, `number`, `string`, `boolean`, `array`, `object`, `null`)
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function any(...types: Parameters<typeof JsonSchema.prototype.oneOf>[0]): JsonSchema {
  return from().any(...types);
}
