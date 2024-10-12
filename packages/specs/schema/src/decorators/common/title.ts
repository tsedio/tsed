import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Add title metadata on the decorated element.
 *
 * ::: warning
 * For v6 user, use @@Title@@ from @tsed/schema instead of @tsed/platform-http.
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
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 */
export function Title(title: string) {
  return JsonEntityFn((entity) => {
    entity.schema.title(title);
  });
}
