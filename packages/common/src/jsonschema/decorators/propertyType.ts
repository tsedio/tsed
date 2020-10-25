import {Type} from "@tsed/core";
import {CollectionOf as C} from "@tsed/schema";

/**
 * Set the type of the array items. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * ::: tip
 * This decorator is used by the Converters to correctly deserialize your model.
 * :::
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(String)
 *    property: string[];
 * }
 * ```
 * ::: warning
 * Don't use `type Type = string | number` as Type parameter.
 * :::
 *
 * The following code doesn't work:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @CollectionOf(Type)
 *    property: Type[];
 * }
 * ```
 *
 * Instead, this code works with converter and AJV:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @Property()
 *    @Any("string", "number") // for AJV
 *    property: Type[];
 * }
 * ```
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorator
 * @validation
 * @jsonMapper
 * @schema
 * @property
 * @collections
 * @ignore
 * @deprecated Since v6. Use @CollectionOf decorator from @tsed/schema instead of.
 */
export function CollectionOf(type: Type<any>) {
  return C(type);
}
