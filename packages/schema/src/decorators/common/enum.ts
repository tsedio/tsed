import {isObject} from "@tsed/core";
import {JSONSchema6Type} from "json-schema";
import {JsonSchemaStoreFn} from "./jsonSchemaStoreFn";

const transformTsEnum = (enumValue: any) => {
  return Object.keys(enumValue).reduce((acc: any, key: any) => {
    if (isNaN(+key)) {
      const value = enumValue[key];

      return acc.concat(value);
    }

    return acc;
  }, []);
};

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
export function Enum(enumValue: JSONSchema6Type | any, ...enumValues: JSONSchema6Type[]) {
  return JsonSchemaStoreFn(store => {
    const values = [enumValue].concat(enumValues).reduce((acc, value) => {
      if (isObject(value)) {
        value = transformTsEnum(value);
      }

      return acc.concat(value);
    }, []);

    const types = values.reduce((set: Set<any>, value: any) => set.add(typeof value), new Set());

    store.itemSchema.enum(values).any(...types);
  });
}
