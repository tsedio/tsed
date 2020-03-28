import {JSONSchema6Type} from "json-schema";
import {JsonSchemaStoreFn} from "./jsonSchemaStoreFn";

/**
 * The const keyword is used to restrict a value to a fixed value.
 *
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
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @schema
 */
export function Const(constValue: JSONSchema6Type | any) {
  return JsonSchemaStoreFn(store => {
    store.itemSchema.const(constValue);
  });
}
