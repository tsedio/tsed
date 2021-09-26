import {
  decorateMethodsOf,
  DecoratorMethodParameters,
  DecoratorParameters,
  decoratorTypeOf,
  DecoratorTypes,
  Type,
  UnsupportedDecoratorType
} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";

/**
 * Change authentication options.
 *
 * ```typescript
 * @Controller('/mypath')
 * @UseAuth(MyAuthStrategy, {role: ''})
 * class MyCtrl {
 *
 *   @Get('/')
 *   @AuthOptions(MyAuthStrategy, {role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param guardAuth
 * @param options {Object} Object passed to the customer auth strategy
 * @returns {Function}
 * @decorator
 * @decorator
 * @operation
 */
export function AuthOptions(guardAuth: Type<any>, options: Record<string, unknown> = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.METHOD:
        return JsonEntityFn((entity) => {
          const store = entity.store;

          store.merge(guardAuth, options, true);
        })(...(args as DecoratorMethodParameters));

      case DecoratorTypes.CLASS:
        decorateMethodsOf(args[0], AuthOptions(guardAuth, options));
        break;

      default:
        throw new UnsupportedDecoratorType(AuthOptions, args);
    }
  };
}
