import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Add title metadata on the decorated element.
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
 * @jsonMapper
 * @swagger
 * @schema
 * @classDecorator
 * @input
 * @model
 */
export function Title(title: string) {
  return JsonEntityFn((entity) => {
    entity.schema.title(title);
  });
}
