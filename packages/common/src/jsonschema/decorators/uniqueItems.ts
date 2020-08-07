import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@UniqueItems@@ from @tsed/schema instead of @tsed/common.
 * :::
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
 *    @CollectionOf(String)
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
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @collections
 */
export function UniqueItems(uniqueItems: boolean = true) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.uniqueItems = uniqueItems;
  });
}
