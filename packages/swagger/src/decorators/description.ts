import {Schema} from "@tsed/common";
import {getDecoratorType, Store} from "@tsed/core";
import {BaseParameter} from "./baseParameter";
import {Operation} from "./operation";

/**
 * Add a description metadata on the decorated element.
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
 * @jsonschema
 * @property
 * @class
 * @method
 * @parameter
 */
export function Description(description: string) {
  return (...args: any[]) => {
    const type = getDecoratorType(args);
    switch (type) {
      case "parameter":
        return BaseParameter({description})(...args);
      case "method":
        return Operation({description})(...args);
      case "class":
        Store.from(...args).set("description", description);
      default:
        Schema({description})(...args);
    }
  };
}
