import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Add a name metadata on the decorated element.
 *
 * ## Examples
 * ### On parameters
 *
 * ```typescript
 * async myMethod(@Name("nameOf") @PathParams("id") id: string): Promise<Model>  {
 *
 * }
 * ```
 *
 * ### On parameters
 *
 * ```typescript
 * @Name("AliasName")
 * @Controller("/")
 * class ModelCtrl {
 *
 * }
 * ```
 *
 * @param name
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @classDecorator
 * @operation
 */
export function Name(name: any) {
  return JsonEntityFn((store: JsonEntityStore, args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.CLASS:
        store.schema.name(name);
        break;
      case DecoratorTypes.PARAM:
        store.parameter!.name(name);
        break;
      default:
        store.parent.schema.addAlias(args[1], name);
    }
  });
}
