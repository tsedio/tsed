import type {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

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
export function array(): JsonSchema<any[]>;
export function array<I>(item: JsonSchema<I>): JsonSchema<I[]>;
export function array<I = any>(item?: JsonSchema<I>): JsonSchema<I[]> {
  const schema = from(Array);
  return (item ? (schema.items(item as JsonSchema) as any) : (schema as any)) as JsonSchema<I[]>;
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
export function map(): JsonSchema<Record<string, any>>;
export function map<V>(value: JsonSchema<V>): JsonSchema<Map<string, V>>;
export function map<V = any>(value?: JsonSchema<V>): JsonSchema<Map<string, V>> {
  const schema = from(Map).unknown(true);
  return (value ? (schema.additionalProperties(value as JsonSchema) as any) : (schema as any)) as JsonSchema<Map<string, V>>;
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
 *
 * @schemaFunctional
 */
export function set(): JsonSchema<Set<any>>;
export function set<I>(item: JsonSchema<I>): JsonSchema<Set<I>>;
export function set<I = any>(item?: JsonSchema<I>): JsonSchema<Set<I>> {
  const schema = from(Array).uniqueItems(true);
  return (item ? (schema.items(item as JsonSchema) as any) : (schema as any)) as JsonSchema<Set<I>>;
}

/**
 * Declare a new object model with `additionalProperties: true` (record-like). If a value schema is provided, it is used
 * as `additionalProperties` and its type will be inferred as `Record<string, V>`.
 *
 * ```json
 * { "type": "object", "additionalProperties": true }
 * ```
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function record<K extends string | number | symbol = string, V = any>(): JsonSchema<Record<K, V>>;
export function record<V>(value: JsonSchema<V>): JsonSchema<Record<string, V>>;
export function record<K extends string | number | symbol = string, V = any>(value?: JsonSchema<V>): JsonSchema<Record<K, V>> {
  const schema = from(Object).unknown(true);
  return (value ? (schema.additionalProperties(value as JsonSchema) as any) : (schema as any)) as JsonSchema<Record<K, V>>;
}
