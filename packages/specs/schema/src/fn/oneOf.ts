import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 */
export function oneOf(...oneOf: Parameters<JsonSchema["oneOf"]>[0]): JsonSchema {
  return from().oneOf(oneOf);
}
