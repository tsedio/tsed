import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "../common/jsonEntityFn";

/**
 * Set class path
 *
 * @param path
 * @decorator
 * @class
 */
export function Path(path: string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.CLASS) {
      throw new UnsupportedDecoratorType(Path, args);
    }

    store.path = path;
  });
}
