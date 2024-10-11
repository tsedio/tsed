import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value of this keyword MUST be a non-negative integer.
 * :::
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MaxProperties@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### On prop
 * ```typescript
 * class Model {
 *    @MaxProperties(10)
 *    property: any;
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
 *       "type": "any",
 *       "maxProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### On class
 *
 * ```typescript
 * @MaxProperties(10)
 * class Model {
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "maxProperties": 10
 * }
 * ```
 *
 * ### On Parameter
 *
 * ```typescript
 *
 * class Model {
 *   method(@Any() @MaxProperties(10) obj: any){}
 * }
 * ```
 *
 * @param {number} maxProperties The maximum properties allowed on the given object
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @collections
 * @ajv-errors
 */
export const MaxProperties = withErrorMsg("maxProperties", (maxProperties: number) => {
  if (maxProperties < 0) {
    throw new Error("The value of maxProperties MUST be a non-negative integer.");
  }

  return JsonEntityFn((store) => {
    store.isCollection ? store.schema.maxProperties(maxProperties) : store.itemSchema.maxProperties(maxProperties);
  });
});
