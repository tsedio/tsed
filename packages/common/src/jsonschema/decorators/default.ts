import {Default as D} from "@tsed/schema";

/**
 * There are no restrictions placed on the value of this keyword.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Default@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * This keyword can be used to supply a default JSON value associated with a particular schema.
 * It is RECOMMENDED that a default value be valid against the associated schema.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Default("10")
 *    property: string = "10";
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
 *       "default": "10"
 *     }
 *   }
 * }
 * ```
 *
 * @param {string | number | boolean | {}} defaultValue
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Use @Default decorator from @tsed/schema instead of.
 */
export function Default(defaultValue: string | number | boolean | {}) {
  return D(defaultValue);
}
