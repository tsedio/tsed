import {enumsRegistry} from "../registries/enumRegistries.js";
import {from} from "./from.js";
import type {TypedJsonSchema} from "./types.js";

/**
 * Declare a new enum model.
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 * @param e
 */
export function enums<E extends Record<string, string | number>>(e: E): TypedJsonSchema<E[keyof E]>;
export function enums<T extends readonly (string | number)[]>(e: T): TypedJsonSchema<T[number]>;
export function enums(e: any) {
  // Do not force a specific "type"; just declare the enum values to support both string and number enums
  const schema = from().enum(e) as any;
  enumsRegistry.set(e, schema as any);

  return schema;
}
