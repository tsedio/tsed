import type {JSONSchema6TypeName} from "json-schema";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {Type} from "@tsed/core";

/**
 * Allows a property to accept any type or a union of specified types.
 *
 * The `@Any()` decorator creates a flexible schema that accepts multiple types. When called
 * without arguments, it allows all JSON Schema types. When called with specific types, it
 * restricts to those types only.
 *
 * ### Accept All Types
 *
 * ```typescript
 * class FlexibleModel {
 *   @Any()
 *   property: any;
 *   // Accepts: string, number, boolean, object, array, or null
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": ["integer", "number", "string", "boolean", "array", "object", "null"]
 * }
 * ```
 *
 * ### Restrict to Specific Types
 *
 * ```typescript
 * class UnionModel {
 *   @Any(String, Number, Boolean)
 *   property: string | number | boolean;
 *   // Only accepts string, number, or boolean
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": ["string", "integer", "number", "boolean"]
 * }
 * ```
 *
 * ### With Custom Classes
 *
 * ```typescript
 * class UserModel {
 *   @Property()
 *   name: string;
 * }
 *
 * class FlexibleData {
 *   @Any(String, UserModel)
 *   data: string | UserModel;
 *   // Accepts either a string or a UserModel object
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Dynamic Data**: When property type varies based on runtime conditions
 * - **Migrations**: During API transitions when type requirements change
 * - **Polymorphic Data**: When different types are valid in the same field
 * - **Third-party Integration**: When dealing with untyped external data
 *
 * ### Considerations
 *
 * - More specific decorators like `@String()`, `@Number()` provide better validation
 * - Consider using `@OneOf()` or `@AnyOf()` for complex type unions with constraints
 * - Overuse of `@Any()` can reduce type safety benefits
 *
 * @param types - Optional list of types to restrict to (if omitted, allows all types)
 *
 * @decorator
 * @validation
 * @public
 */
export function Any(...types: (JSONSchema6TypeName | Type<any> | any)[]) {
  return JsonEntityFn((store) => {
    store.itemSchema.any(...types);
  });
}
