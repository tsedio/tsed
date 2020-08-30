import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * A numeric instance is valid only if division by this keyword's value results in an integer.
 *
 * ::: warning
 * The value of `multipleOf` MUST be a number, strictly greater than 0.
 * :::
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@MultipleOf@@ from @tsed/schema instead of @tsed/common.
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
 */
export function MultipleOf(multipleOf: number) {
  if (multipleOf <= 0) {
    throw new Error("The value of multipleOf MUST be a number, strictly greater than 0.");
  }

  return decoratorSchemaFactory((schema) => {
    schema.mapper.multipleOf = multipleOf;
  });
}
