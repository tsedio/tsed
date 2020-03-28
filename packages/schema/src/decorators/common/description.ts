import {DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "@tsed/schema";
import {JsonSchemaStore} from "../../domain/JsonSchemaStore";

/**
 * Add a description to the class, method or property
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
 * @decorator
 * @property
 * @class
 * @method
 * @parameter
 */
export function Description(description: any) {
  return JsonSchemaStoreFn((store, args) => {
    switch (getDecoratorType(args, true)) {
      case DecoratorTypes.PROP:
      case DecoratorTypes.CLASS:
        store.schema.description(description);
        break;

      case DecoratorTypes.PARAM:
        store.parameter?.description(description);
        break;

      case DecoratorTypes.METHOD:
        store.operation?.description(description);
        break;

      default:
        throw new UnsupportedDecoratorType(Description, args);
    }
  });
}
