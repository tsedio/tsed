import {JSONSchema6Type} from "json-schema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

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
 * @param {string | number | boolean | {}} enumValue
 * @param enumValues
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function Enum(enumValue: JSONSchema6Type, ...enumValues: JSONSchema6Type[]) {
    return decoratorSchemaFactory((schema) => {
        schema.mapper.enum = [enumValue].concat(enumValues);
    });
}