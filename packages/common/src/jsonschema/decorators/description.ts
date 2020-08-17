import {Description as D} from "@tsed/schema";

/**
 * Add description metadata on the decorated element.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Title@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Description("description")
 *    id: string;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "id": {
 *        "type": "string",
 *        "description": "description"
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} description
 * @decorator
 * @swagger
 * @schema
 * @ignore
 * @deprecated Use @Description decorator from @tsed/schema instead of.
 */
export function Description(description: string) {
  return D(description);
}
