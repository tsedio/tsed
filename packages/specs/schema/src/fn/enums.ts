import type {JsonSchema} from "../domain/JsonSchema.js";
import {enumsRegistry} from "../registries/enumRegistries.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";

// Overload for enum-like object (TS enum or const object)
export function enums<E extends Record<string, string | number>>(e: E): SchemaShape<E[keyof E]> & JsonSchema & TypedChain<E[keyof E]>;
// Overload for readonly array of string|number literals
export function enums<T extends readonly (string | number)[]>(e: T): SchemaShape<T[number]> & JsonSchema & TypedChain<T[number]>;
export function enums(e: any) {
  // Do not force a specific "type"; just declare the enum values to support both string and number enums
  const schema = from().enum(e) as any;
  enumsRegistry.set(e, schema as any);

  return schema;
}
