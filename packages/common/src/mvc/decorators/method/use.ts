import {EndpointMetadata} from "@tsed/common";
import {decoratorTypeOf, DecoratorTypes, Store, Type} from "@tsed/core";

/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @Use(Middleware1)
 * export class Ctrl {
 *
 *    @Get('/')
 *    @Use(Middleware2)
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
export function Use(...args: any[]): Function {
  return <T>(target: Type<any>, targetKey?: string, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    if (decoratorTypeOf([target, targetKey, descriptor]) === DecoratorTypes.METHOD) {
      EndpointMetadata.get(target, targetKey!).use(args);

      return descriptor;
    }

    Store.from(target).merge("middlewares", {
      use: args
    });
  };
}
