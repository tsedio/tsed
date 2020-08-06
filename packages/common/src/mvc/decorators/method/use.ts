import {decoratorTypeOf, DecoratorTypes, Store, Type} from "@tsed/core";
import {HTTP_METHODS} from "../../constants/index";
import {EndpointMetadata} from "../../models/EndpointMetadata";

function mapOptions(args: any[]) {
  let method: string | undefined = undefined;
  let path: string | RegExp | undefined = undefined;

  const middlewares = args.filter((arg: any) => {
    if (typeof arg === "string" && HTTP_METHODS.includes(arg)) {
      method = arg;

      return false;
    }

    if (typeof arg === "string" || arg instanceof RegExp) {
      path = arg ? arg : "/";

      return false;
    }

    return !!arg;
  });

  return {
    path,
    method,
    middlewares
  };
}

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
 * @operation
 */
export function Use(...args: any[]): Function {
  return <T>(target: Type<any>, targetKey?: string, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    if (decoratorTypeOf([target, targetKey, descriptor]) === DecoratorTypes.METHOD) {
      const options = mapOptions(args);
      const endpoint = EndpointMetadata.get(target, targetKey!);

      options.path && endpoint.pathsMethods.push({
        method: options.method,
        path: options.path!
      });

      endpoint.use(args);

      return descriptor;
    }

    Store.from(target).merge("middlewares", {
      use: args
    });
  };
}
