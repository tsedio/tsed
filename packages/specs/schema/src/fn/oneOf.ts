import type {AnyJsonSchema, JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 */
export function oneOf(...oneOf: AnyJsonSchema[]): JsonSchema {
  return from().oneOf(oneOf);
}
