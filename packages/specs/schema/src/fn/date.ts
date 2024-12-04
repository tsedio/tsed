import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new string model with `format: date`.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function date(): JsonSchema {
  return from(Date).format(JsonFormatTypes.DATE);
}

/**
 * Declare a new string model with `format: datetime`.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function datetime(): JsonSchema {
  return from(Date).format(JsonFormatTypes.DATE_TIME);
}

/**
 * Declare a new string model with `format: time`.
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function time(): JsonSchema {
  return from(Date).format(JsonFormatTypes.TIME);
}
