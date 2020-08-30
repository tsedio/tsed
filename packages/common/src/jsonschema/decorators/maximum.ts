import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * The value of `maximum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to `maximum`.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Maximum@@ from @tsed/schema instead of @tsed/common.
 * :::
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
 * @swagger
 * @schema
 */
export function Maximum(maximum: number, exclusive: boolean = false) {
  return decoratorSchemaFactory((schema) => {
    if (exclusive) {
      schema.mapper.exclusiveMaximum = maximum;
    } else {
      schema.mapper.maximum = maximum;
    }
  });
}
