import {DecoratorParameters, getDecoratorType, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";
import {EndpointRegistry} from "../../registries/EndpointRegistry";

/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @UseBefore(Middleware1) // called only one time before all endpoint
 * export class Ctrl {
 *
 *    @Get('/')
 *    @UseBefore(Middleware2)
 *    get() { }
 * }
 * ```
 *
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 * @endpoint
 */
export function UseBefore(...args: any[]): Function {
  return <T>(...decoratorArgs: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (getDecoratorType(decoratorArgs, true)) {
      case "method":
        EndpointRegistry.useBefore(decoratorArgs[0], decoratorArgs[1]!, args);

        return decoratorArgs[2] as any;
      case "class":
        StoreMerge("middlewares", {useBefore: args})(...decoratorArgs);
        break;
      default:
        throw new UnsupportedDecoratorType(UseBefore, decoratorArgs);
    }
  };
}
