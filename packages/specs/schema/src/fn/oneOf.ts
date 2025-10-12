import type {AnyJsonSchema, JsonSchema} from "../domain/JsonSchema.js";
import type {Infer} from "../domain/types.js";
import {from} from "./from.js";

/**
 * See https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.28
 */
export function oneOf<S extends Array<AnyJsonSchema | null>>(...oneOf: S): JsonSchema<Infer<S[number]>> {
  return from().oneOf(oneOf) as unknown as JsonSchema<Infer<S[number]>>;
}
