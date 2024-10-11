import {withErrorMsg} from "../../utils/withErrorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 *
 * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).
 *
 * ::: warning
 * The value of minLength MUST be a non-negative integer.
 * :::
 *
 * ::: tip
 * Omitting this keyword has the same behavior as a value of 0.
 * :::
 *
 * ::: warning
 * For v6 user, use @@MinLength@@ from @tsed/schema instead of @tsed/platform-http.
 * :::
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @MinLength(10)
 *    property: number;
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
 *       "maxLength": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @MinLength(10)
 *    @CollectionOf(String)
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
 *       "items": {
 *          "type": "string",
 *          "minLength": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minLength
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @ajv-errors
 */
export const MinLength = withErrorMsg("minLength", (minLength: number) => {
  if (minLength < 0) {
    throw new Error("The value of minLength MUST be a non-negative integer.");
  }

  return JsonEntityFn((store) => {
    store.itemSchema.minLength(minLength);
  });
});
