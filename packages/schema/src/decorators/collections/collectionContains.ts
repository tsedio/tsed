import {CollectionOf} from "./collectionOf";

/**
 * Set the type of the item collection. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * The array instance will be valid against "contains" if at least one of its elements is valid against the given schema.
 *
 * ```typescript
 * class Model {
 *    @CollectionContains(String).MinLength(0).MaxLength(0)
 *    property: string[];
 * }
 * ```
 * ::: warning
 * You musn't use the `type Type = string | number` as parameters Type.
 *
 * This example doesn't work:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @PropertyType(Type)
 *    property: Type[];
 * }
 * ```
 * :::
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorator
 * @schema
 */
export function CollectionContains(type: any) {
  return CollectionOf(type).Contains();
}
