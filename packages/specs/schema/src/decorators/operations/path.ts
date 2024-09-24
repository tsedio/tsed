import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Set class path to expose all endpoints
 *
 * ::: warning
 * Don't use this decorator to change the path if you develop your application with Ts.ED.
 * :::
 *
 * @param path
 * @decorator
 * @swagger
 * @schema
 * @classDecorator
 * @operation
 */
export function Path(path: string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.CLASS) {
      throw new UnsupportedDecoratorType(Path, args);
    }

    store.path = path;
  });
}
