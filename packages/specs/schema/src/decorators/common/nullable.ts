import {Type, useDecorators} from "@tsed/core";
import type {JSONSchema6TypeName} from "json-schema";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {JsonSchema} from "../../domain/JsonSchema.js";
import {OneOf} from "./oneOf.js";
import {Property} from "./property.js";
import {array} from "../../fn/collection.js";

/**
 * Marks a property as nullable, allowing it to accept `null` in addition to its base type.
 *
 * The `@Nullable()` decorator creates a union type that includes `null` alongside the
 * specified type(s). This is implemented using JSON Schema's `oneOf` keyword to allow
 * either the specified type or null.
 *
 * ### Single Type with Null
 *
 * ```typescript
 * class UserModel {
 *   @Nullable(Date)
 *   lastLogin: Date | null;
 *   // Accepts: Date object OR null
 * }
 * ```
 *
 * ### Multiple Types with Null
 *
 * ```typescript
 * class FlexibleModel {
 *   @Nullable(String, Number, Boolean)
 *   property: string | number | boolean | null;
 *   // Accepts: string OR number OR boolean OR null
 * }
 * ```
 *
 * ### With Custom Classes
 *
 * ```typescript
 * class Address {
 *   @Property()
 *   street: string;
 * }
 *
 * class Person {
 *   @Nullable(Address)
 *   address: Address | null;
 *   // Accepts: Address object OR null
 * }
 * ```
 *
 * ### TypeScript Integration
 *
 * ```typescript
 * class Product {
 *   @Nullable(String)
 *   description: string | null;
 *
 *   @Nullable(Number)
 *   discount: number | null;
 * }
 * ```
 *
 * ### Important: Arrays
 *
 * Do NOT use `@Nullable(Array)` as it produces incorrect schemas. Instead:
 *
 * ```typescript
 * // Wrong
 * @Nullable(Array)
 * items: any[] | null;
 *
 * // Correct
 * @Schema(array().items().nullable())
 * items: any[] | null;
 * ```
 *
 * ### Use Cases
 *
 * - **Optional Database Fields**: Model nullable database columns
 * - **Partial Updates**: Allow fields to be explicitly set to null in PATCH requests
 * - **Default Values**: Distinguish between "not provided" and "explicitly null"
 * - **External APIs**: Match nullable fields from third-party services
 *
 * ### vs Optional
 *
 * - `@Nullable()`: Field can be present with value `null`
 * - `@Optional()`: Field can be omitted entirely
 * - Can combine both: `@Optional() @Nullable(String)` allows omitted, null, or string
 *
 * @param type - The primary type that can be null
 * @param types - Additional types that can be null (creates multi-type union with null)
 *
 * @decorator
 * @validation
 * @public
 */
export function Nullable(type: JSONSchema6TypeName | Type<any> | any, ...types: (JSONSchema6TypeName | Type<any> | any)[]) {
  types = [type, ...types];

  if (type === Array) {
    return JsonEntityFn((entity) => {
      entity.schema.assign(
        array()
          .items({})
          .$comment(
            "Warning: you should not use @Nullable(Array), which leads to an incorrect schema. Use @Schema(array().items().nullable()) instead"
          )
          .nullable(true)
      );
    });
  }

  return useDecorators(types.length === 1 && !(type instanceof JsonSchema) && Property(types[0]), OneOf(null, ...types));
}
