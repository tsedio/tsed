import {DecoratorParameters, decoratorTypeOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

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
 * @validation
 * @swagger
 * @schema
 * @input
 * @classDecorator
 * @methodDecorator
 * @propertyDecorator
 * @parameterDecorator
 */
export function Description(description: any) {
  return JsonEntityFn((store: JsonEntityStore, args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
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
