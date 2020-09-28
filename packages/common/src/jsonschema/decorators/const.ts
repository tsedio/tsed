import {Const as C} from "@tsed/schema";
import {JSONSchema6Type} from "json-schema";

/**
 * The const keyword is used to restrict a value to a fixed value.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Const@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 * ### With a string
 *
 * ```typescript
 * class Model {
 *    @Const("value1")
 *    property: "value1";
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
 *       "const": "value1"
 *     }
 *   }
 * }
 * ```
 *  * ### With a boolean
 *
 * ```typescript
 * class Model {
 *    @Const(true)
 *    property: boolean;
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
 *       "type": "boolean",
 *       "const": true
 *     }
 *   }
 * }
 * ```
 *
 * @param {string | number | boolean } constValue
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Since v6. Use @Const decorator from @tsed/schema instead of.
 */
export function Const(constValue: JSONSchema6Type | any) {
  return C(constValue);
}
