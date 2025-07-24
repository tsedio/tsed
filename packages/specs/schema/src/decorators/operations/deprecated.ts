import {decorateMethodsOf, decoratorTypeOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {JsonPropertyStore} from "../../domain/JsonPropertyStore.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Add deprecated metadata on the decorated element.
 *
 * ## Examples
 *
 * ```typescript
 *
 * @Deprecated()
 * class MyCtrl {
 *   @Deprecated()
 *   @Get("/")
 *   method(){
 *   }
 * }
 * ```
 *
 * @param deprecated
 * @decorator
 * @swagger
 * @schema
 * @operation
 */
export function Deprecated(deprecated: boolean = true) {
  return JsonEntityFn((store, args) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.METHOD:
        store.operation!.deprecated(deprecated);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Deprecated(deprecated));
        break;
      case DecoratorTypes.PARAM:
        (store as JsonParameterStore).parameter.set("deprecated", deprecated);
        break;
      case DecoratorTypes.PROP:
        (store as JsonPropertyStore).schema.set("deprecated", deprecated);
        break;

      default:
        throw new UnsupportedDecoratorType(Deprecated, args);
    }
  });
}
