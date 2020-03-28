import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "../common/jsonEntityFn";

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
 * @schema
 * @class
 * @method
 * @property
 * @parameter
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
