import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";
import type {SchemaShape, TypedChain} from "./types.js";

/**
 * Declare a new array model. If an item schema is provided, it will be set as `items` and its type will be inferred.
 *
 * ```json
 * { "type": "array" }
 * ```
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function array(): SchemaShape<any[]> & JsonSchema & TypedChain<any[]>;
export function array<I>(item: SchemaShape<I>): SchemaShape<I[]> & JsonSchema & TypedChain<I[]>;
export function array<I = any>(item?: SchemaShape<I>): SchemaShape<I[]> & JsonSchema & TypedChain<I[]> {
  const schema = from(Array);
  return (item ? (schema.items(item as JsonSchema) as any) : (schema as any)) as SchemaShape<I[]> & JsonSchema & TypedChain<I[]>;
}

/**
 * Declare a new object model with `additionalProperties: true` (map-like). If a value schema is provided, it is used
 * as `additionalProperties` and its type will be inferred.
 *
 * ```json
 * { "type": "object", "additionalProperties": true }
 * ```
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function map(): SchemaShape<Record<string, any>> & JsonSchema & TypedChain<Record<string, any>>;
export function map<V>(value: SchemaShape<V>): SchemaShape<Record<string, V>> & JsonSchema & TypedChain<Record<string, V>>;
export function map<V = any>(value?: SchemaShape<V>): SchemaShape<Record<string, V>> & JsonSchema & TypedChain<Record<string, V>> {
  const schema = from(Map).unknown(true);
  return (value ? (schema.additionalProperties(value as JsonSchema) as any) : (schema as any)) as SchemaShape<Record<string, V>> &
    JsonSchema &
    TypedChain<Record<string, V>>;
}

/**
 * Declare a new array model representing a Set with `uniqueItems: true`. If an item schema is provided, it will be set
 * as `items` and its type will be inferred as `Set<I>`.
 *
 * ```json
 * { "type": "array", "uniqueItems": true }
 * ```
 *
 * See @@JsonSchema@@ to discover available methods.
 */
export function set(): SchemaShape<Set<any>> & JsonSchema & TypedChain<Set<any>>;
export function set<I>(item: SchemaShape<I>): SchemaShape<Set<I>> & JsonSchema & TypedChain<Set<I>>;
export function set<I = any>(item?: SchemaShape<I>): SchemaShape<Set<I>> & JsonSchema & TypedChain<Set<I>> {
  const schema = from(Array).uniqueItems(true);
  return (item ? (schema.items(item as JsonSchema) as any) : (schema as any)) as SchemaShape<Set<I>> & JsonSchema & TypedChain<Set<I>>;
}
