import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * The value of `maximum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to `maximum`.
 *
 * ::: warning
 * For v6 user, use @@Maximum@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Maximum(10)
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
 *       "maximum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Maximum(10)
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
 *          "maximum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maximum The maximum value allowed
 * @param {boolean} exclusive Same effect as ExclusiveMaximum decorator.
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */
export const Maximum = withErrorMsg("maximum", (maximum: number, exclusive: boolean = false) => {
  return JsonEntityFn((store) => {
    exclusive ? store.itemSchema.exclusiveMaximum(maximum) : store.itemSchema.maximum(maximum);
  });
});
/**
 * The value of `maximum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to `maximum`.
 *
 * ::: warning
 * For v6 user, use @@Maximum@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Max(10)
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
 *       "maximum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Max(10)
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
 *          "maximum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maximum The maximum value allowed
 * @param {boolean} exclusive Same effect as ExclusiveMaximum decorator.
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export const Max = Maximum;
