import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";

/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * ```typescript
 * @Controller('/')
 * @UseAfter(Middleware1)
 * export class Ctrl {
 *
 *    @Get('/')
 *    @UseAfter(Middleware2)
 *    get() { }
 * }
 * ```
 *
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 * @operation
 */
export function UseAfter(...args: any[]): Function {
  return JsonEntityFn((entity, parameters) => {
    switch (entity.decoratorType) {
      case DecoratorTypes.METHOD:
        const endpoint = entity;
        endpoint.afterMiddlewares = args.concat(endpoint.afterMiddlewares);

        break;

      case DecoratorTypes.CLASS:
        const middlewares = entity.store.get("middlewares") || {};

        entity.store.set("middlewares", {
          ...middlewares,
          useAfter: [...args, ...(middlewares.useAfter || [])]
        });
        break;

      default:
        throw new UnsupportedDecoratorType(UseAfter, parameters);
    }
  });
}
