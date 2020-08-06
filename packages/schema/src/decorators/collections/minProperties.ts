import {JsonEntityFn} from "../common/jsonEntityFn";

/**
 * An object instance is valid against `minProperties` if its number of properties is less than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value of this keyword MUST be a non-negative integer.
 * :::
 *
 * ## Example
 * ### On prop
 * ```typescript
 * class Model {
 *    @MinProperties(10)
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
 *       "minProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### On class
 *
 * ```typescript
 * @MinProperties(10)
 * class Model {
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "minProperties": 10
 * }
 * ```
 *
 * ### On Parameter
 *
 * ```typescript
 *
 * class Model {
 *   method(@Any() @MinProperties(10) obj: any){}
 * }
 * ```
 *
 * @param {number} minProperties The minimum properties allowed on the object.
 * @decorator
 * @validation
 * @jsonMapper
 * @swagger
 * @schema
 * @input
 * @model
 */
export function MinProperties(minProperties: number) {
  if (minProperties < 0) {
    throw new Error("The value of minProperties MUST be a non-negative integer.");
  }

  return JsonEntityFn(store => {
    store.isCollection ? store.schema.minProperties(minProperties) : store.itemSchema.minProperties(minProperties);
  });
}
