import {Type} from "@tsed/core";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Set the type of the array items. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * ::: tip
 * This decorator is used by the Converters to deserialize correctly your model.
 * :::
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    property: string[];
 * }
 * ```
 * ::: warning
 * You didn't use the `type Type = string | number` as parameters Type.
 * :::
 *
 * Didn't works:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @PropertyType(Type)
 *    property: Type[];
 * }
 * ```
 *
 * Works with converter and AJV:
 *
 * ```typescript
 * type Type = "string" | "number"
 * class Model {
 *    @Property()
 *    @AllowTypes("string", "number") // for AJV
 *    property: Type[];
 * }
 * ```
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
export function PropertyType(type: Type<any>) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.type = type;
  });
}
