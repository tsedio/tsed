import {JsonFormatTypes} from "../domain/JsonFormatTypes.js";
import {from} from "./from.js";

/**
 * Declare a new string model with `format: date`.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function date() {
  return from(Date).format(JsonFormatTypes.DATE);
}

/**
 * Declare a new string model with `format: datetime`.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function datetime() {
  return from(Date).format(JsonFormatTypes.DATE_TIME);
}

/**
 * Declare a new string model with `format: time`.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function time() {
  return from(Date).format(JsonFormatTypes.TIME);
}
