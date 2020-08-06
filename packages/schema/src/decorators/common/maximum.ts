import {JsonEntityFn} from "./jsonEntityFn";

/**
 * The value of `maximum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to `maximum`.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Maximum(10)
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
 *       "maximum": 10
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Maximum(10)
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
 *          "maximum": 10
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maximum The maximum value allowed
 * @param {boolean} exclusive Same effect as ExclusiveMaximum decorator.
 * @decorator
 * @validation
 * @jsonMapper
 * @swagger
 * @schema
 * @input
 * @model
 */
export function Maximum(maximum: number, exclusive: boolean = false) {
  return JsonEntityFn(store => {
    exclusive ? store.itemSchema.exclusiveMaximum(maximum) : store.itemSchema.maximum(maximum);
  });
}

export function Max(maximum: number, exclusive: boolean = false) {
  return Maximum(maximum, exclusive);
}
