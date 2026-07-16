import {JsonEntityFn} from "./jsonEntityFn.js";
import type {JsonSchema} from "../../domain/JsonSchema.js";

/**
 * Validates that a value must match ALL of the provided schemas (intersection).
 *
 * The `allOf` keyword from JSON Schema allows combining multiple schemas where the
 * value must satisfy every schema in the list. This is useful for:
 * - Merging multiple schema constraints
 * - Composing validation rules from different sources
 * - Creating intersections of object types
 *
 * ### Basic Usage
 *
 * ```typescript
 * @AllOf(
 *   { type: "object", properties: { id: { type: "number" } } },
 *   { type: "object", properties: { name: { type: "string" } } }
 * )
 * class Combined {
 *   // Must satisfy both schemas
 *   // Equivalent to: { id: number, name: string }
 * }
 * ```
 *
 * ### With Model References
 *
 * ```typescript
 * class BaseModel {
 *   @Property()
 *   id: number;
 * }
 *
 * class NamedModel {
 *   @Property()
 *   name: string;
 * }
 *
 * @AllOf(BaseModel, NamedModel)
 * class CombinedModel {
 *   // Inherits validation from both BaseModel and NamedModel
 * }
 * ```
 *
 * ### Validation Composition
 *
 * ```typescript
 * @AllOf(
 *   { minProperties: 1 },
 *   { maxProperties: 10 }
 * )
 * class BoundedObject {
 *   // Must have between 1 and 10 properties
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Mixin Patterns**: Combine validation from multiple models
 * - **Constraint Merging**: Apply multiple validation rules together
 * - **Type Intersection**: Create types that must satisfy multiple schemas
 *
 * @param allOf - One or more schemas that the value must satisfy
 *
 * @decorator
 * @validation
 * @public
 * @see https://json-schema.org/understanding-json-schema/reference/combining#allOf
 */
export function AllOf(...allOf: Parameters<JsonSchema["allOf"]>[0]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.allOf(allOf);
  });
}
