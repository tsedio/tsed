import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Add security metadata on the decorated method.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Security("write:calendars")
 *    async method() {}
 * }
 * ```
 *
 * @param name
 * @param scopes
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 */
export function Security(name: string, ...scopes: string[]) {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        store.operation!.addSecurityScopes(name, scopes);
        break;
      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], Security(name, ...scopes));
        break;

      default:
        throw new UnsupportedDecoratorType(Security, args);
    }
  });
}
