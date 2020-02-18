"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * The enum keyword is used to restrict a value to a fixed set of values.
 * It must be an array with at least one element, where each element is unique.
 *
 * Elements in the array might be of any value, including null.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Enum("value1", "value2")
 *    property: "value1" | "value2";
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "string",
 *       "enum": ["value1", "value2"]
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Enum("value1", "value2")
 *    property: ("value1" | "value2")[];
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "array",
 *       "items": {
 *          "type": "string",
 *          "enum": ["value1", "value2"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### With Typescript Enum
 *
 * ```typescript
 * enum SomeEnum {
 *    ENUM_1 = "enum1",
 *    ENUM_2 = "enum2"
 * }
 *
 * class Model {
 *    @Enum(SomeEnum)
 *    property: SomeEnum;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *        "type": "string",
 *        "enum": ["enum1", "enum2"]
 *     }
 *   }
 * }
 * ```
 *
 * @param {string | number | boolean | {}} enumValue
 * @param enumValues
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
function Enum(enumValue, ...enumValues) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory(schema => {
        if (typeof enumValue === "object") {
            const info = Object.keys(enumValue).reduce((acc, key) => {
                if (isNaN(+key)) {
                    const value = enumValue[key];
                    const type = typeof value;
                    if (acc.type.indexOf(type) === -1) {
                        acc.type.push(type);
                    }
                    acc.values.push(value);
                }
                return acc;
            }, { type: [], values: [] });
            schema.mapper.type = info.type.length === 1 ? info.type[0] : info.type;
            schema.mapper.enum = info.values;
        }
        else {
            schema.mapper.enum = [enumValue].concat(enumValues);
        }
    });
}
exports.Enum = Enum;
//# sourceMappingURL=enum.js.map