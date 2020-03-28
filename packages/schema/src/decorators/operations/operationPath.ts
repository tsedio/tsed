import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

export enum OperationMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS"
}

/**
 * Declare new Operation with his path and http method.
 * @param method
 * @param path
 * @decorator
 * @method
 */
export function OperationPath(method: OperationMethods | string, path: string | RegExp = "/") {
  return JsonSchemaStoreFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.METHOD) {
      throw new UnsupportedDecoratorType(OperationPath, args);
    }

    store.operation!.addOperationPath(method, path);
  });
}
