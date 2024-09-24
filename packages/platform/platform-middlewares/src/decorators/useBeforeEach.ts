import {decorateMethodsOf, DecoratorParameters, decoratorTypeOf, DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {UseBefore} from "./useBefore.js";

/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @UseBeforeEach(Middleware1)  // Called before each endpoint
 * export class Ctrl {
 *
 *    @Get('/')
 *    get() { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param args
 * @decorator
 * @operation
 */
export function UseBeforeEach(...args: any[]): Function {
  return <T>(...decoratorArgs: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(decoratorArgs)) {
      case DecoratorTypes.METHOD:
        return UseBefore(...args)(...decoratorArgs);

      case DecoratorTypes.CLASS:
        decorateMethodsOf(decoratorArgs[0], UseBefore(...args));
        break;

      default:
        throw new UnsupportedDecoratorType(UseBeforeEach, decoratorArgs);
    }
  };
}
