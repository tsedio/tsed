import {
  applyDecorators,
  decorateMethodsOf,
  DecoratorParameters,
  getDecoratorType,
  Store,
  StoreFn,
  Type,
  UnsupportedDecoratorType
} from "@tsed/core";
import {AuthOptions, IAuthOptions} from "./authOptions";
import {UseBefore} from "./useBefore";

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
 * @endpoint
 */
export function UseAuth(guardAuth: Type<any>, options: IAuthOptions = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(args, true)) {
      case "method":
        return applyDecorators(
          StoreFn((store: Store) => {
            if (!store.has(guardAuth)) {
              return UseBefore(guardAuth);
            }
          }),
          AuthOptions(guardAuth, options)
        )(...args);

      case "class":
        decorateMethodsOf(args[0], UseAuth(guardAuth, options));
        break;

      default:
        throw new UnsupportedDecoratorType(UseAuth, args);
    }
  };
}
