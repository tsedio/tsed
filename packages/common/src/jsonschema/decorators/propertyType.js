"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = require("./property");
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
function PropertyType(type) {
    return property_1.PropertyFn((propertyMetadata) => {
        propertyMetadata.type = type;
    });
}
exports.PropertyType = PropertyType;
//# sourceMappingURL=propertyType.js.map