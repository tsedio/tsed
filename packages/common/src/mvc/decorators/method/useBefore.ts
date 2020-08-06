import {DecoratorParameters, decoratorTypeOf, DecoratorTypes, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";
import {EndpointFn} from "./endpointFn";

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
 * @operation
 */
export function UseBefore(...args: any[]): Function {
  return <T>(...decoratorArgs: DecoratorParameters): TypedPropertyDescriptor<T> | void => {
    switch (decoratorTypeOf(decoratorArgs)) {
      case DecoratorTypes.METHOD:
        EndpointFn((endpoint) => {
          endpoint.before(args);
        })(...(decoratorArgs as [any, string, PropertyDescriptor]));

        return decoratorArgs[2] as any;
      case DecoratorTypes.CLASS:
        StoreMerge("middlewares", {useBefore: args})(...decoratorArgs);
        break;
      default:
        throw new UnsupportedDecoratorType(UseBefore, decoratorArgs);
    }
  };
}
