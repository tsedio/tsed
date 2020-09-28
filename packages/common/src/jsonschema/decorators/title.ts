import {Title as T} from "@tsed/schema";

/**
 * Add title metadata on the decorated element.
 *
 * ::: warning
 * This decorator will be removed in v7.
 *
 * For v5 user, use @@Title@@ from @tsed/common instead of @tsed/swagger.
 *
 * For v6 user, use @@Title@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Title("title")
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
 *        "title": "title"
 *     }
 *   }
 * }
 * ```
 *
 * @param {string} title
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @propertyDecorator
 * @input
 * @ignore
 * @deprecated Since v6. Use @Title decorator from @tsed/schema instead of.
 */
export function Title(title: string) {
  return T(title);
}
