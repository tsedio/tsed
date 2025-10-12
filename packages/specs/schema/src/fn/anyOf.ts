import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {Infer} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 * @schemaFunctional
 */
export function anyOf<S extends Array<JsonSchema<any>>>(...anyOf: S): JsonSchema<Infer<S[number]>> {
  return from().anyOf(anyOf) as unknown as JsonSchema<Infer<S[number]>>;
}
