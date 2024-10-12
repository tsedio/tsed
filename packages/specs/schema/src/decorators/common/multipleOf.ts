import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * A numeric instance is valid only if division by this keyword's value results in an integer.
 *
 * ::: warning
 * The value of `multipleOf` MUST be a number, strictly greater than 0.
 * :::
 *
 * ::: warning
 * For v6 user, use @@MultipleOf@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @MultipleOf(2)
 *    property: Number;
 * }
 * ```
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "number",
 *       "multipleOf": 2
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @CollectionOf(number)
 *    @MultipleOf(2)
 *    property: number[];
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
 *       "items": {
 *          "type": "number",
 *          "multipleOf": 2
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} multipleOf The multiple value allowed
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */
export const MultipleOf = withErrorMsg("multipleOf", (multipleOf: number) => {
  if (multipleOf <= 0) {
    throw new Error("The value of multipleOf MUST be a number, strictly greater than 0.");
  }

  return JsonEntityFn((store) => {
    store.itemSchema.multipleOf(multipleOf);
  });
});
