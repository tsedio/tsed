import {Description as D} from "@tsed/schema";

/**
 * Add description metadata on the decorated element.
 *
 * ::: warning
 * This decorator will be removed in v7.
 *
 * For v5 user, use @@Description@@ from @tsed/common instead of @tsed/swagger.
 *
 * For v6 user, use @@Description@@ from @tsed/schema instead of @tsed/common.
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
 * @deprecated Since v6. Use @Description decorator from @tsed/schema instead of.
 */
export function Description(description: string) {
  return D(description);
}
