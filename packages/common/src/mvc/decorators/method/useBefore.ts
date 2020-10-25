import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";
import {EndpointMetadata} from "../../models/EndpointMetadata";

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
  return JsonEntityFn((entity, parameters) => {
    switch (entity.decoratorType) {
      case DecoratorTypes.METHOD:
        const endpoint = entity as EndpointMetadata;
        endpoint.beforeMiddlewares = args.concat(endpoint.beforeMiddlewares);

        break;

      case DecoratorTypes.CLASS:
        const middlewares = entity.store.get("middlewares") || {};

        entity.store.set("middlewares", {
          ...middlewares,
          useBefore: [...args, ...(middlewares.useBefore || [])]
        });
        break;

      default:
        throw new UnsupportedDecoratorType(UseBefore, parameters);
    }
  });
}
