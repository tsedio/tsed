import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

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
 * @decorator
 * @class
 * @method
 * @param name
 * @param scopes
 */
export function Security(name: string, ...scopes: string[]) {
  return JsonSchemaStoreFn((store, args) => {
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
