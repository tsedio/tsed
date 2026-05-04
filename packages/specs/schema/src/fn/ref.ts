import {JsonSchema} from "../domain/JsonSchema.js";

/**
 * Create a schema reference from an external or internal `$ref` URI.
 *
 * ### Example
 *
 * ```typescript
 * const UserRef = ref("https://api.example.com/doc/swagger.json#/components/schemas/User");
 * ```
 *
 * @param path - The reference URI
 * @returns A JsonSchema containing the `$ref`
 * @schemaFunctional
 */
export function ref<T = unknown>(path: string) {
  return new JsonSchema<T>().$ref(path);
}
