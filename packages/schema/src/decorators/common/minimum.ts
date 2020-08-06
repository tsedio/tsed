import {JsonEntityFn} from "./jsonEntityFn";

/**
 * The value of `minimum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to `minimum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Minimum(10)
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
 *       "type": "number",
 *       "minimum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Minimum(10)
 *    @PropertyType(Number)
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
 *          "minimum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minimum The minimum value allowed
 * @param {boolean} exclusive
 * @decorator
 * @validation
 * @jsonMapper
 * @swagger
 * @schema
 * @input
 * @model
 */
export function Minimum(minimum: number, exclusive: boolean = false) {
  return JsonEntityFn(store => {
    exclusive ? store.itemSchema.exclusiveMinimum(minimum) : store.itemSchema.minimum(minimum);
  });
}

/**
 * The value of `minimum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to `minimum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Min(10)
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
 *       "type": "number",
 *       "minimum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Min(10)
 *    @CollectionOf(Number)
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
 *          "minimum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @alias Minimum
 * @param minimum The minimum value allowed
 * @param exclusive
 * @decorator
 * @validation
 * @jsonMapper
 * @swagger
 * @schema
 * @input
 */
export function Min(minimum: number, exclusive: boolean = false) {
  return Minimum(minimum, exclusive);
}
