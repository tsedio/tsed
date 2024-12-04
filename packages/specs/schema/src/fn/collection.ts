import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new object model with `additionalProperties: true`.
 *
 * ```json
 * {
 *   "type": "array"
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function array(): JsonSchema {
  return from(Array);
}

/**
 * Declare a new object model with `additionalProperties: true`.
 *
 * ```json
 * {
 *   "type": "object",
 *   "additionalProperties": true
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function map(): JsonSchema {
  return from(Map).unknown(true);
}

/**
 * Declare a new array model with `uniqueItems: true`.
 *
 * ```json
 * {
 *   "type": "array",
 *   "uniqueItems": true
 * }
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 */
export function set(): JsonSchema {
  return from(Array).uniqueItems(true);
}
