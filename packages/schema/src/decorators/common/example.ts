import {DecoratorParameters, DecoratorTypes, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Add a example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 */
export function Example(...examples: any[]): Function {
  return JsonEntityFn((store: JsonEntityStore, args: DecoratorParameters) => {
    switch (getDecoratorType(args, true)) {
      case DecoratorTypes.CLASS:
      case DecoratorTypes.PROP:
      case DecoratorTypes.PARAM:
      case DecoratorTypes.METHOD:
        store.schema.examples(examples);
        break;

      default:
        throw new UnsupportedDecoratorType(Example, args);
    }
  });
}
