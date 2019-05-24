import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).
 *
 * !> The value of `maxLength` MUST be a non-negative integer.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @MaxLength(10)
 *    property: number;
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
 *       "maxLength": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @MaxLength(10)
 *    @PropertyType(String)
 *    property: string[];
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
 *          "maxLength": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maxLength
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function MaxLength(maxLength: number) {
  if (maxLength < 0) {
    throw new Error("The value of maxLength MUST be a non-negative integer.");
  }

  return decoratorSchemaFactory(schema => {
    schema.mapper.maxLength = maxLength;
  });
}
