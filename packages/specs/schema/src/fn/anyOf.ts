import {from} from "./from.js";
import type {Infer, SchemaShape, TypedJsonSchema} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 * @schemaFunctional
 */
export function anyOf<S extends Array<SchemaShape<any>>>(...anyOf: S): TypedJsonSchema<Infer<S[number]>> {
  return from().anyOf(anyOf) as unknown as TypedJsonSchema<Infer<S[number]>>;
}
