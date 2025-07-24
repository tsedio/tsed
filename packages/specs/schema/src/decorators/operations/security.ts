import {decorateMethodsOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {OpenSpecSecurity} from "@tsed/openspec";

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
export function Security(name: string, ...scopes: string[]): Function;
/**
 * Add security metadata on the decorated method.
 *
 * You can use it to add multiple authentication types.
 * See <https://swagger.io/docs/specification/authentication/#multiple>.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Security([{ "A": ["scope-1"] }, { "B": [], "C": ["scope-2", "scope-3"]}])
 *    async method() {}
 * }
 * ```
 * this will add the following security metadata
 * ```yaml
 * security: # A OR (B AND C)
 *   - A: ["scope-1"]
 *   - B: []
 *     C: ["scope-2", "scope-3"]
 * ```
 *
 * @param security
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 */
export function Security(security: OpenSpecSecurity): Function;
export function Security(nameOrSecurity: string | OpenSpecSecurity, ...scopes: string[]): Function {
  return JsonEntityFn((store, args) => {
    switch (store.decoratorType) {
      case DecoratorTypes.METHOD:
        if (Array.isArray(nameOrSecurity)) {
          store.operation!.security(nameOrSecurity);
        } else {
          store.operation!.addSecurityScopes(nameOrSecurity, scopes);
        }
        break;
      case DecoratorTypes.CLASS:
        if (Array.isArray(nameOrSecurity)) {
          decorateMethodsOf(args[0], Security(nameOrSecurity));
        } else {
          decorateMethodsOf(args[0], Security(nameOrSecurity, ...scopes));
        }
        break;

      default:
        throw new UnsupportedDecoratorType(Security, args);
    }
  });
}
