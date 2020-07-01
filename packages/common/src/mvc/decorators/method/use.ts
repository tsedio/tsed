import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn, OperationMethods, OperationPath} from "@tsed/schema";
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
  return JsonEntityFn((entity, parameters) => {
    switch (entity.decoratorType) {
      case DecoratorTypes.METHOD:
        const endpoint = entity as EndpointMetadata;
        const options = mapOptions(args);

        options.path && OperationPath(options.method || OperationMethods.CUSTOM, options.path)(...parameters);

        endpoint.use(args);
        break;

      case DecoratorTypes.CLASS:
        entity.store.merge("middlewares", {
          use: args
        });
        break;

      default:
        throw new UnsupportedDecoratorType(Use, parameters);
    }
  });
}
