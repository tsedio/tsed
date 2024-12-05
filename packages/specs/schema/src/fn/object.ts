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
 * @returns {JsonSchema} A new object model with the specified properties
 */
export function object(properties: {[key: string]: JsonSchema} = {}): JsonSchema {
  return from(Object).properties(properties);
}
