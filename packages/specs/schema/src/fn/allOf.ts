import {from} from "./from.js";
import type {Infer, SchemaShape, TypedJsonSchema, UnionToIntersection} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.26
 *
 * @schemaFunctional
 */
export function allOf<S extends Array<SchemaShape<any>>>(...allOf: S): TypedJsonSchema<UnionToIntersection<Infer<S[number]>>> {
  return from().allOf(allOf) as unknown as TypedJsonSchema<UnionToIntersection<Infer<S[number]>>>;
}
