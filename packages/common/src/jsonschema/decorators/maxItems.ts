import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * The value `maxItems` MUST be a non-negative integer.
 *
 * An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MaxItems(10)
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
 *       "type": "number",
 *       "maxItems": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maxItems
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 */
export function MaxItems(maxItems: number) {
  if (maxItems < 0) {
    throw new Error("The value of maxItems MUST be a non-negative integer.");
  }

  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.maxItems = maxItems;
  });
}
