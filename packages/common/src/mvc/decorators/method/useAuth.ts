import {decorateMethodsOf, DecoratorParameters, getDecoratorType, Store, Type, UnsupportedDecoratorType} from "@tsed/core";
import {UseBefore} from "./useBefore";

export interface IUseAuthOptions {
  responses?: {
    [statusCode: string]: {
      description: string;
    };
  };
  security?: {
    [securityName: string]: string[];
  }[];

  [key: string]: any;
}

/**
 * Use custom authentication strategy on your endpoint.
 *
 * ```typescript
 * @ControllerProvider('/mypath')
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
 */
export function UseAuth(guardAuth: Type<any>, options: IUseAuthOptions = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(args, true)) {
      case "method":
        return Store.decorate((store: Store) => {
          store.set(guardAuth, options);

          if (options.responses) {
            const {responses} = options;
            store.merge("responses", responses);
          }

          if (options.security) {
            const {security} = options;
            store.merge("operation", {security});
          }

          return UseBefore(guardAuth);
        })(...args);

      case "class":
        decorateMethodsOf(args[0], UseAuth(guardAuth, options));
        break;

      default:
        throw new UnsupportedDecoratorType(UseAuth, args);
    }
  };
}
