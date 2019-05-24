import {Minimum} from "./minimum";

/**
 * The value of `exclusiveMinimum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) `exclusiveMinimum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMinimum(10)
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
 *       "exclusiveMinimum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMinimum(10)
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
 *          "exclusiveMinimum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param minimum
 * @param {boolean} exclusiveMinimum
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function ExclusiveMinimum(minimum: number, exclusiveMinimum: boolean = true) {
  return Minimum(minimum, exclusiveMinimum);
}
