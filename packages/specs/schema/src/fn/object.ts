import {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {PropsToShape, SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new object model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * ### Example
 *
 * ```typescript
 * const userSchema = object({
 *   name: string(),
 *   age: number()
 * });
 * ```
 *
 * @param properties - An object containing property definitions where each value is a JsonSchema
 * @returns {JsonSchema} A new object model with the specified properties
 */
export function object<P extends Record<string, SchemaShape<any>> = Record<string, SchemaShape<any>>>(
  properties: P = {} as P
): SchemaShape<PropsToShape<P>> & JsonSchema & TypedChain<PropsToShape<P>> {
  // runtime still expects JsonSchema instances; SchemaShape is compatible at runtime
  const schema = from(Object).properties(properties as unknown as {[key: string]: JsonSchema});
  return schema as unknown as SchemaShape<PropsToShape<P>> & JsonSchema & TypedChain<PropsToShape<P>>;
}
