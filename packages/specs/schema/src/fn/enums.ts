import type {JsonSchema} from "../domain/JsonSchema.js";
import {enumsRegistry} from "../registries/enumRegistries.js";
import {from} from "./from.js";

/**
 * Declare a new enum model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @param e
 */
export function enums<E extends Record<string, string | number>>(e: E): JsonSchema<E[keyof E]>;
export function enums<T extends readonly (string | number)[]>(e: T): JsonSchema<T[number]>;
export function enums(e: any) {
  const schema = from().enum(e) as any;
  enumsRegistry.set(e, schema as any);

  return schema;
}
