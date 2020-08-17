import {MinProperties as M} from "@tsed/schema";

/**
 * An object instance is valid against `minProperties` if its number of properties is less than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value of this keyword MUST be a non-negative integer.
 * :::
 *
 * ::: tip
 * Omitting this keyword has the same behavior as a value of 0.
 * :::
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MinProperties@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 * ### On prop
 * ```typescript
 * class Model {
 *    @Any()
 *    @MinProperties(10)
 *    property: any;
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
 *       "type": "any",
 *       "minProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minProperties The minimum properties allowed on the object.
 * @validation
 * @swagger
 * @schema
 * @collections
 * @ignore
 * @deprecated Use @MinProperties decorator from @tsed/schema instead of.
 */
export function MinProperties(minProperties: number) {
  return M(minProperties);
}
