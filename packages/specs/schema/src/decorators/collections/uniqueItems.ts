import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
 *
 * ::: warning
 * For v6 user, use @@UniqueItems@@ from @tsed/schema instead of @tsed/platform-http.
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
 * @ajv-errors
 */
export const UniqueItems = withErrorMsg("uniqueItems", (uniqueItems: boolean = true) => {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.schema.uniqueItems(uniqueItems);
  });
});
