import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

/**
 * Set class path
 *
 * @param path
 * @decorator
 * @class
 */
export function Path(path: string) {
  return JsonSchemaStoreFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.CLASS) {
      throw new UnsupportedDecoratorType(Path, args);
    }

    store.path = path;
  });
}
