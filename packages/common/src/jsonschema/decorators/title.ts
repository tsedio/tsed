import {Schema} from "./schema";

/**
 * Add title metadata on the decorated element.
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
 */
export function Title(title: string) {
  return Schema({title});
}
