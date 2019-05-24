import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * The value of `minimum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to `minimum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Minimum(10)
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
 *       "type": "number",
 *       "minimum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Minimum(10)
 *    @PropertyType(Number)
 *    property: number[];
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
 *          "type": "number",
 *          "minimum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minimum
 * @param {boolean} exclusive
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function Minimum(minimum: number, exclusive: boolean = false) {
  return decoratorSchemaFactory(schema => {
    if (exclusive) {
      schema.mapper.exclusiveMinimum = minimum;
    } else {
      schema.mapper.minimum = minimum;
    }
  });
}
