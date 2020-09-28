import {ExclusiveMinimum as E} from "@tsed/schema";

/**
 * The value of `exclusiveMinimum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) `exclusiveMinimum`.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@ExclusiveMinimum@@ from @tsed/schema instead of @tsed/common.
 * :::
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
 *    @CollectionOf(Number)
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
 * @validation
 * @property
 * @ignore
 * @deprecated Since v6. Use @ExclusiveMinimum decorator from @tsed/schema instead of.
 */
export function ExclusiveMinimum(minimum: number, exclusiveMinimum: boolean = true) {
  return E(minimum, exclusiveMinimum);
}
