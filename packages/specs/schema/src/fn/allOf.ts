import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {Infer, SchemaShape, TypedChain, UnionToIntersection} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 */
export function allOf<S extends Array<SchemaShape<any>>>(
  ...allOf: S
): SchemaShape<UnionToIntersection<Infer<S[number]>>> & JsonSchema & TypedChain<UnionToIntersection<Infer<S[number]>>> {
  return from().allOf(allOf) as unknown as SchemaShape<UnionToIntersection<Infer<S[number]>>> &
    JsonSchema &
    TypedChain<UnionToIntersection<Infer<S[number]>>>;
}
