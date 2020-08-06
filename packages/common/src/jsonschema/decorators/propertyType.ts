import {Type} from "@tsed/core";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Set the type of the array items. The possible value is String, Boolean, Number, Date, Object, Class, etc...
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@CollectionOf@@ from @tsed/schema.
 * For v5 user, use @@CollectionOf@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
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
 * @deprecated Use CollectionOf instead. Will be removed in v6.
 */
export function PropertyType(type: Type<any>) {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.type = type;
  });
}

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
 * @alias PropertyType
 */
export function CollectionOf(type: Type<any>) {
  return PropertyType(type);
}
