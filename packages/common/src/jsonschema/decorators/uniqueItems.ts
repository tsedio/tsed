import {UniqueItems as U} from "@tsed/schema";

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
 * @ignore
 * @collections
 * @deprecated Since v6. Use @UniqueItems decorator from @tsed/schema instead of.
 */
export function UniqueItems(uniqueItems: boolean = true) {
  return U(uniqueItems);
}
