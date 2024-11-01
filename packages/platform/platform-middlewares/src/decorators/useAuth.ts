import {
  decorateMethodsOf,
  DecoratorParameters,
  decoratorTypeOf,
  DecoratorTypes,
  Store,
  StoreFn,
  Type,
  UnsupportedDecoratorType,
  useDecorators
} from "@tsed/core";

import {AuthOptions} from "./authOptions.js";
import {UseBefore} from "./useBefore.js";

/**
 * Use custom authentication strategy on your endpoint.
 *
 * ```typescript
 * @Controller('/mypath')
 * @UseAuth(MyAuthStrategy)
 * class MyCtrl {
 *
 *   @Get('/')
 *   @UseAuth(MyAuthStrategy, {role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param guardAuth {Type<any>} A middleware which implement a custom auth strategy
 * @param options {Object} Object passed to the customer auth strategy
 * @returns {Function}
 * @decorator
 * @operation
 */
export function UseAuth(guardAuth: Type<any>, options: Record<string, unknown> = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.METHOD:
        return useDecorators(
          StoreFn((store: Store) => {
            if (!store.has(guardAuth)) {
              return UseBefore(guardAuth);
            }
          }),
          AuthOptions(guardAuth, options)
        )(...args);

      case DecoratorTypes.CLASS:
        decorateMethodsOf(
          args[0],
          StoreFn((store: Store) => {
            if (!store.has(guardAuth)) {
              return UseBefore(guardAuth);
            }
          })
        );

        AuthOptions(guardAuth, options)(...args);
        break;

      default:
        throw new UnsupportedDecoratorType(UseAuth, args);
    }
  };
}
