import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

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
 * For v6 user, use @@MaxItems@@ from @tsed/schema instead of @tsed/platform-http.
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
 * @input
 * @collections
 * @ajv-errors
 */
export const MaxItems = withErrorMsg("maxItems", (maxItems: number) => {
  if (maxItems < 0) {
    throw new Error("The value of maxItems MUST be a non-negative integer.");
  }

  return JsonEntityFn((storedJson) => {
    storedJson.schema.maxItems(maxItems);
  });
});
