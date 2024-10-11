import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

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
 * For v6 user, use @@MinItems@@ from @tsed/schema instead of @tsed/platform-http.
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
 *       "type": "array",
 *       "minItems": 10,
 *       "items": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minItems
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @collections
 * @ajv-errors
 */
export const MinItems = withErrorMsg("minItems", (minItems: number) => {
  if (minItems < 0) {
    throw new Error("The value of minItems MUST be a non-negative integer.");
  }

  return JsonEntityFn((storedJson) => {
    storedJson.schema.minItems(minItems);
  });
});
