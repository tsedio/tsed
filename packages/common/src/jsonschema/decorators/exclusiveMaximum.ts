import {Maximum} from "./maximum";

/**
 * The value of `exclusiveMaximum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) `exclusiveMaximum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMaximum(10)
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
 *       "exclusiveMaximum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @ExclusiveMaximum(10)
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
 *          "exclusiveMaximum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param maximum
 * @param {boolean} exclusiveMaximum
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function ExclusiveMaximum(maximum: number, exclusiveMaximum: boolean = true) {
  return Maximum(maximum, exclusiveMaximum);
}
