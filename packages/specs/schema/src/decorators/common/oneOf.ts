import {JsonEntityFn} from "./jsonEntityFn.js";
import type {JsonSchema} from "../../domain/JsonSchema.js";

/**
 * Validates that a value must match EXACTLY ONE of the provided schemas (exclusive union).
 *
 * The `oneOf` keyword from JSON Schema requires the value to be valid against exactly
 * one schema in the list - not zero and not more than one. This is useful for strict
 * union types where overlapping schemas should be rejected.
 *
 * ### Basic Usage
 *
 * ```typescript
 * @OneOf(
 *   { type: "string" },
 *   { type: "number" }
 * )
 * class StringOrNumber {
 *   // Valid: "hello" OR 42
 *   // Invalid: true (matches neither), or ambiguous values matching multiple schemas
 * }
 * ```
 *
 * ### Discriminated Unions
 *
 * ```typescript
 * @OneOf(
 *   {
 *     type: "object",
 *     properties: { type: { const: "email" }, email: { type: "string" } },
 *     required: ["type", "email"]
 *   },
 *   {
 *     type: "object",
 *     properties: { type: { const: "phone" }, phone: { type: "string" } },
 *     required: ["type", "phone"]
 *   }
 * )
 * class Contact {
 *   // Must be EITHER email contact OR phone contact, not both or neither
 * }
 * ```
 *
 * ### With Model Classes
 *
 * ```typescript
 * class CreditCard {
 *   @Const("credit")
 *   type: "credit";
 *
 *   @Property()
 *   cardNumber: string;
 * }
 *
 * class BankTransfer {
 *   @Const("bank")
 *   type: "bank";
 *
 *   @Property()
 *   iban: string;
 * }
 *
 * @OneOf(CreditCard, BankTransfer)
 * class PaymentMethod {
 *   // Must be exactly one payment method type
 * }
 * ```
 *
 * ### Nullable with OneOf
 *
 * ```typescript
 * @OneOf(null, { type: "string" })
 * class NullableString {
 *   // Exactly null OR exactly a string
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Strict Union Types**: Enforce exactly one type from a set
 * - **Discriminated Unions**: Type-safe polymorphic data structures
 * - **Mutually Exclusive Options**: Ensure only one option is selected
 * - **Nullable Types**: Combine with null for nullable properties
 *
 * ### oneOf vs anyOf vs allOf
 *
 * - `@OneOf()`: Must match **exactly one** schema (exclusive)
 * - `@AnyOf()`: Must match **at least one** schema (inclusive)
 * - `@AllOf()`: Must match **all** schemas (intersection)
 *
 * ### Compatibility Note
 *
 * OneOf is not supported by OpenAPI 2.0 (Swagger). For OpenAPI 2.0 compatibility,
 * consider using discriminator patterns or upgrade to OpenAPI 3.0.
 *
 * @param oneOf - Schemas where exactly one must be satisfied
 *
 * @decorator
 * @validation
 * @public
 * @see https://json-schema.org/understanding-json-schema/reference/combining#oneOf
 */
export function OneOf(...oneOf: Parameters<JsonSchema["oneOf"]>[0]) {
  return JsonEntityFn((entity) => {
    entity.schema.oneOf(oneOf);
  });
}
