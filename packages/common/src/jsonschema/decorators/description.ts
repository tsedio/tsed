import {decoratorTypeOf, DecoratorTypes, Store, StoreMerge} from "@tsed/core";
import {Schema} from "./schema";

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
 */
export function Description(description: string) {
  return (...args: any[]) => {
    const type = decoratorTypeOf(args);
    switch (type) {
      case DecoratorTypes.METHOD:
        return StoreMerge("operation", {description})(...args);
      case DecoratorTypes.PARAM:
        return StoreMerge("baseParameter", {description})(...args);
      case DecoratorTypes.CLASS:
        Store.from(...args).set("description", description);

      default:
        Schema({description})(...args);
    }
  };
}
