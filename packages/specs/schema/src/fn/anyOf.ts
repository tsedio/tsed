import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {Infer, SchemaShape, TypedChain} from "./types.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.27
 */
export function anyOf<S extends Array<SchemaShape<any>>>(
  ...anyOf: S
): SchemaShape<Infer<S[number]>> & JsonSchema & TypedChain<Infer<S[number]>> {
  return from().anyOf(anyOf) as unknown as SchemaShape<Infer<S[number]>> & JsonSchema & TypedChain<Infer<S[number]>>;
}
