import {Description as D} from "@tsed/common";

/**
 * Add a description metadata on the decorated element.
 *
 * ::: warning
 * This decorator will be removed in v7.
 *
 * For v5 user, use @@Description@@ from @tsed/common instead of @tsed/swagger.
 *
 * For v6 user, use @@Description@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Examples
 * ### On class
 *
 * ```typescript
 * @Description("description")
 * class Model {
 *
 * }
 * ```
 *
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Description("description")
 *    async method() {}
 * }
 * ```
 *
 * ### On parameter
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    async method(@Description("description") @PathParam("id") id: string) {}
 * }
 * ```
 *
 * ### On property
 *
 * ```typescript
 * class Model {
 *    @Description("description")
 *    id: string;
 * }
 * ```
 *
 * @param {string} description
 * @returns {Function}
 * @decorator
 * @swagger
 * @schema
 * @operation
 * @classParameter
 * @classDecorator
 * @methodDecorator
 * @deprecated Use @Description from @tsed/common instead.
 * @ignore
 */
export function Description(description: string) {
  return D(description);
}
