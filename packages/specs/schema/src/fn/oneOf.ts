import {from} from "./from.js";
import type {Infer, SchemaShape, TypedJsonSchema} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 */
export function oneOf<S extends Array<SchemaShape<any>>>(...oneOf: S): TypedJsonSchema<Infer<S[number]>> {
  return from().oneOf(oneOf) as unknown as TypedJsonSchema<Infer<S[number]>>;
}
