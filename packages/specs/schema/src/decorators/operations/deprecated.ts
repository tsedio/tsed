import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "../common/jsonEntityFn";

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
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.deprecated(deprecated);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Deprecated(deprecated));
        break;

      default:
        throw new UnsupportedDecoratorType(Deprecated, args);
    }
  });
}
