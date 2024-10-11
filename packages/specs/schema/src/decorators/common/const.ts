import type {JSONSchema6Type} from "json-schema";

import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * The const keyword is used to restrict a value to a fixed value.
 *
 * ::: warning
 * For v6 user, use @@Const@@ from @tsed/schema instead of @tsed/platform-http.
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
 */
export function Const(constValue: JSONSchema6Type | any) {
  return JsonEntityFn((store) => {
    store.itemSchema.const(constValue);
  });
}
