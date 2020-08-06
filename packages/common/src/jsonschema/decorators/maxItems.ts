import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * The value `maxItems` MUST be a non-negative integer.
 *
 * An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.
 *
 * :: warning
 * The value `maxItems` MUST be a non-negative integer.
 * :::
 *
 * :: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MaxItems@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(String)
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
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @collections
 */
export function MaxItems(maxItems: number) {
  if (maxItems < 0) {
    throw new Error("The value of maxItems MUST be a non-negative integer.");
  }

  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.maxItems = maxItems;
  });
}
