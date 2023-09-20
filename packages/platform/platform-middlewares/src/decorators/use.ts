import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn, Operation} from "@tsed/schema";

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
        return Operation(...args);

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
