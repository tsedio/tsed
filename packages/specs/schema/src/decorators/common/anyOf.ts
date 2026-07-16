import {JsonEntityFn} from "./jsonEntityFn.js";
import type {JsonSchema} from "../../domain/JsonSchema.js";

/**
 * Validates that a value must match AT LEAST ONE of the provided schemas (union).
 *
 * The `anyOf` keyword from JSON Schema allows combining multiple schemas where the
 * value must satisfy at least one schema in the list. This is useful for creating
 * union types with different validation rules for each variant.
 *
 * ### Basic Usage
 *
 * ```typescript
 * @AnyOf(
 *   { type: "string", minLength: 5 },
 *   { type: "number", minimum: 100 }
 * )
 * class StringOrLargeNumber {
 *   // Valid: "hello" (string >= 5 chars) OR 150 (number >= 100)
 *   // Invalid: "hi" (too short) OR 50 (too small)
 * }
 * ```
 *
 * ### With Model References
 *
 * ```typescript
 * class EmailContact {
 *   @Property()
 *   @Email()
 *   email: string;
 * }
 *
 * class PhoneContact {
 *   @Property()
 *   @Pattern(/^\d{10}$/)
 *   phone: string;
 * }
 *
 * @AnyOf(EmailContact, PhoneContact)
 * class Contact {
 *   // Must be either a valid EmailContact OR a valid PhoneContact
 * }
 * ```
 *
 * ### Multiple Constraints
 *
 * ```typescript
 * @AnyOf(
 *   { type: "object", required: ["id"] },
 *   { type: "object", required: ["name"] }
 * )
 * class FlexibleIdentifier {
 *   // Must have either 'id' property OR 'name' property (or both)
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Union Types**: Model TypeScript union types with validation
 * - **Alternative Formats**: Accept data in multiple valid formats
 * - **Flexible APIs**: Support different request shapes in the same endpoint
 *
 * ### Compatibility Note
 *
 * AnyOf is not supported by OpenAPI 2.0 (Swagger). For OpenAPI 2.0 compatibility,
 * consider using simpler alternatives or upgrade to OpenAPI 3.0.
 *
 * @param anyOf - One or more schemas where at least one must be satisfied
 *
 * @decorator
 * @validation
 * @public
 * @see https://json-schema.org/understanding-json-schema/reference/combining#anyOf
 */
export function AnyOf(...anyOf: Parameters<JsonSchema["anyOf"]>[0]) {
  return JsonEntityFn((entity) => {
    entity.itemSchema.anyOf(anyOf);
  });
}
