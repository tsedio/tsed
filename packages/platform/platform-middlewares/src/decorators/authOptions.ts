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

export interface IAuthOptions {
  /**
   * @deprecated Since v6. Use @Returns from @tsed/schema
   */
  responses?: {
    [statusCode: string]: {
      description: string;
    };
  };
  /**
   * @deprecated Since v6. Use @Security from @tsed/schema
   */
  security?:
    | {
        [securityName: string]: string[];
      }[]
    | {
        [securityName: string]: string[];
      };

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
 * @decorator
 * @operation
 */
export function AuthOptions(guardAuth: Type<any>, options: IAuthOptions = {}): Function {
  return <T>(...args: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.METHOD:
        return JsonEntityFn((entity) => {
          const store = entity.store;

          if (options.responses) {
            const {responses} = options;
            store.merge("responses", responses, true);
            options.responses = undefined;
          }

          if (options.security) {
            const {security} = options;
            [].concat(security as any).forEach((security) => {
              Object.entries(security).forEach(([name, scopes]: [string, string[]]) => {
                entity.operation!.addSecurityScopes(name, scopes);
              });
            });

            options.security = undefined;
          }

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
