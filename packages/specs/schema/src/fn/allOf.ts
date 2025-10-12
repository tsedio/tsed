import type {AnyJsonSchema, JsonSchema} from "../domain/JsonSchema.js";
import type {Infer, UnionToIntersection} from "../domain/types.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 * @schemaFunctional
 */
export function allOf<S extends Array<AnyJsonSchema | null>>(...allOf: S): JsonSchema<UnionToIntersection<Infer<S[number]>>> {
  return from().allOf(allOf) as unknown as JsonSchema<UnionToIntersection<Infer<S[number]>>>;
}
