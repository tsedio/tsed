import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Add produces metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Produces("text/html")
 *    id: string;
 * }
 * ```
 *
 * ::: warning
 * For openspec v3 prefer `@Returns().ContentType()` usage (see @@Returns@@).
 * :::
 *
 * @param produces
 * @decorator
 * @swagger
 * @methodDecorator
 * @classDecorator
 * @operation
 * @response
 */
export function Produces(...produces: string[]) {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.produces(produces);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Produces(...produces));
        break;

      default:
        throw new UnsupportedDecoratorType(Produces, args);
    }
  });
}
