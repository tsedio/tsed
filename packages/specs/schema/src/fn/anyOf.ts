import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 */
export function anyOf(...anyOf: Parameters<typeof JsonSchema.prototype.allOf>[0]): JsonSchema {
  return from().anyOf(anyOf);
}
