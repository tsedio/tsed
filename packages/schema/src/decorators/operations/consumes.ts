import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

/**
 * Add consumes metadata on the decorated element.
 *
 * ## Examples
 *
 * ```typescript
 * class Model {
 *    @Consumes("application/x-www-form-urlencoded")
 *    id: string;
 * }
 * ```
 *
 * @class
 * @method
 * @decorator
 * @param consumes
 */
export function Consumes(...consumes: string[]) {
  return JsonSchemaStoreFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.consumes(consumes);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Consumes(...consumes));
        break;

      default:
        throw new UnsupportedDecoratorType(Consumes, args);
    }
  });
}
