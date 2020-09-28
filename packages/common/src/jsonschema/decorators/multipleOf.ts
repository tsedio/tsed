import {MultipleOf as M} from "@tsed/schema";

/**
 * A numeric instance is valid only if division by this keyword's value results in an integer.
 *
 * ::: warning
 * The value of `multipleOf` MUST be a number, strictly greater than 0.
 * :::
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MultipleOf@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @MultipleOf(2)
 *    property: Number;
 * }
 * ```
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "number",
 *       "multipleOf": 2
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(number)
 *    @MultipleOf(2)
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
 *          "multipleOf": 2
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} multipleOf The multiple value allowed
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Since v6. Use @MultipleOf decorator from @tsed/schema instead of.
 */
export function MultipleOf(multipleOf: number) {
  return M(multipleOf);
}
