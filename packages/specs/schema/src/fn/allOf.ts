import type {AnyJsonSchema, JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 */
export function allOf(...allOf: AnyJsonSchema[]): JsonSchema {
  return from().allOf(allOf);
}
