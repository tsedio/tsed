import {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

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
 * @returns A new object model with the specified properties
 * @schemaFunctional
 */
export function object<P extends Record<string, JsonSchema<any>> = Record<string, JsonSchema<any>>>(properties: P = {} as P) {
  return from(Object).properties(properties);
}
