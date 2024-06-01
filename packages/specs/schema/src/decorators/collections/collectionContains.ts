import {CollectionOf} from "./collectionOf.js";

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
 *
 * @param {Type<any>} type
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @collections
 */
export function CollectionContains(type: any) {
  return CollectionOf(type).Contains();
}
