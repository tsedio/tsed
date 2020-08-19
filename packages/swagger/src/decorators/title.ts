import {Title as T} from "@tsed/common";

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
 * ## Examples
 * ### On parameter
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    async method(@Title("title") @BodyParams("id") id: string) {}
 * }
 * ````
 *
 * Will produce:
 *
 * ```json
 * {
 *   "name":"body",
 *   "in":"body",
 *   "title":"title"
 * }
 * ```
 *
 * ### On property
 *
 ```typescript
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
 * > Note: Title can be used on a method but swagger didn't use this key to describe an Operation.
 *
 * @param {string} title
 * @returns {(...args: any[]) => any}
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @parameterDecorator
 * @methodDecorator
 * @ignore
 * @deprecated Use @Title from @tsed/common instead.
 */
export function Title(title: string) {
  return T(title);
}
