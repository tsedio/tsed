import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonEntityFn} from "../common/jsonEntityFn";
import {OperationMethods} from "../../constants/httpMethods";

/**
 * Declare new Operation with his path and http method.
 *
 * ::: warning
 * Don't use decorator with Ts.ED application.
 *
 * Use theses decorators instead:
 *
 * <ApiList query="status.includes('decorator') && status.includes('httpMethod')" />
 *
 * :::
 *
 * @param method
 * @param path
 * @decorator
 * @swagger
 * @schema
 * @operation
 */
export function OperationPath(method: OperationMethods | string, path: string | RegExp = "/") {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.METHOD) {
      throw new UnsupportedDecoratorType(OperationPath, args);
    }

    store.operation!.addOperationPath(method.toUpperCase(), path);
  });
}
