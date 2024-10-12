import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {Maximum} from "./maximum.js";

/**
 * The value of `exclusiveMaximum` MUST be number, representing an exclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then the instance is valid only if it has a value strictly less than (not equal to) `exclusiveMaximum`.
 *
 * ::: warning
 * For v6 user, use @@ExclusiveMaximum@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
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
 *          "exclusiveMaximum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param maximum
 * @param {boolean} exclusiveMaximum
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */
export const ExclusiveMaximum = withErrorMsg("exclusiveMaximum", (maximum: number, exclusiveMaximum: boolean = true) => {
  return Maximum(maximum, exclusiveMaximum);
});
