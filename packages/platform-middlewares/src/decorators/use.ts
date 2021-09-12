import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn, OperationMethods, OperationPath} from "@tsed/schema";
import {mapUseOptions} from "../utils/mapUseOptions";

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
        const options = mapUseOptions(args);

        options.path && OperationPath(options.method || OperationMethods.CUSTOM, options.path)(...parameters);

        entity.use(args);
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
