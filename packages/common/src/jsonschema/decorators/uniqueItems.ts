import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @UniqueItems()  // default true
 *    property: number[];
 * }
 * ```
 *
 *  * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @UniqueItems()
 *    property: string[];
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
 *       "uniqueItems": true,
 *       "items": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {boolean} uniqueItems
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 */
export function UniqueItems(uniqueItems: boolean = true) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.uniqueItems = uniqueItems;
  });
}
