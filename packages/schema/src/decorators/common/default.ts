import {JsonSchemaStoreFn} from "./jsonSchemaStoreFn";

/**
 * There are no restrictions placed on the value of this keyword.
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
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @schema
 */
export function Default(defaultValue: string | number | boolean | {}) {
  return JsonSchemaStoreFn(store => {
    store.itemSchema.default(defaultValue);
  });
}
