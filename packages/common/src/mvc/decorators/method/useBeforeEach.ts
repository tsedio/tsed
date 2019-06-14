import {decorateMethodsOf, DecoratorParameters, getDecoratorType, UnsupportedDecoratorType} from "@tsed/core";
import {UseBefore} from "./useBefore";

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
 * @endpoint
 */
export function UseBeforeEach(...args: any[]): Function {
  return <T>(...decoratorArgs: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(decoratorArgs, true)) {
      case "method":
        return UseBefore(...args)(...decoratorArgs);

      case "class":
        decorateMethodsOf(decoratorArgs[0], UseBefore(...args));
        break;

      default:
        throw new UnsupportedDecoratorType(UseBeforeEach, decoratorArgs);
    }
  };
}
