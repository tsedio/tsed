import {decorateMethodsOf, DecoratorParameters, getDecoratorType, Store, StoreFn, Type, UnsupportedDecoratorType} from "@tsed/core";

export interface IAuthOptions {
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
 * @endpoint
 */
export function AuthOptions(guardAuth: Type<any>, options: IAuthOptions = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(args, true)) {
      case "method":
        return StoreFn((store: Store) => {
          if (options.responses) {
            const {responses} = options;
            store.merge("responses", responses, true);
            delete options.responses;
          }

          if (options.security) {
            const {security} = options;
            store.merge("operation", {security}, true);
            delete options.security;
          }

          store.merge(guardAuth, options, true);
        })(...args);

      case "class":
        decorateMethodsOf(args[0], AuthOptions(guardAuth, options));
        break;

      default:
        throw new UnsupportedDecoratorType(AuthOptions, args);
    }
  };
}
