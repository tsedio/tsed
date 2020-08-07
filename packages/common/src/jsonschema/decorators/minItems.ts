import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value `minItems` MUST be a non-negative integer.
 * :::
 *
 * ::: tip
 * Omitting this keyword has the same behavior as a value of 0.
 * :::
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MinItems@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(String)
 *    @MinItems(10)
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
 *       "type": "string",
 *       "minItems": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minItems
 * @returns {Function}
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @collections
 */
export function MinItems(minItems: number) {
  if (minItems < 0) {
    throw new Error("The value of minItems MUST be a non-negative integer.");
  }

  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.minItems = minItems;
  });
}
