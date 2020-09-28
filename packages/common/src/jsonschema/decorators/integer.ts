import {Integer as I} from "@tsed/schema";

/**
 * Set integer type.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Integer@@ from @tsed/schema instead of @@Integer@@ from @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Integer()
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
 *       "type": "integer"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array of multiple types
 *
 * ```typescript
 * class Model {
 *    @Integer()
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
 *          "type": "integer"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Since v6. Use @Integer decorator from @tsed/schema instead of.
 */
export function Integer() {
  return I();
}
