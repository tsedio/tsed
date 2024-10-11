import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {Minimum} from "./minimum.js";

/**
 * The value of `exclusiveMinimum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) `exclusiveMinimum`.
 *
 * ::: warning
 * For v6 user, use @@ExclusiveMinimum@@ from @tsed/schema instead of @tsed/platform-http.
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
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */
export const ExclusiveMinimum = withErrorMsg("exclusiveMinimum", (minimum: number, exclusiveMinimum: boolean = true) => {
  return Minimum(minimum, exclusiveMinimum);
});
