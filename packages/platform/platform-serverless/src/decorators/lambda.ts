import {useDecorators} from "@tsed/core";
import {JsonEntityFn, JsonSchemaObject, OperationId, OperationMethods, OperationPath} from "@tsed/schema";

export interface LambdaOptions {
  name?: string;
  path: string;
  method: OperationMethods | string;
}

export interface LambdaChainedDecorators {
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

  /**
   *
   * @param name
   */
  Name(name: string): this;

  Method(method: string): this;

  Path(path: string): this;
}
/**
 * Declare a lambda endpoint.
 *
 * ```typescript
 * export class Lambda {
 *
 * }
 * ```
 *
 * @decorator
 */
export function Lambda(name?: string): LambdaChainedDecorators {
  const options: LambdaOptions = {
    path: "/",
    method: "",
    name
  };

  const decorator: any = JsonEntityFn((entity) => {
    return useDecorators(OperationPath(options.method, options.path), OperationId(options.name || String(entity.propertyKey)));
  });

  decorator.Name = (name: string) => {
    options.name = name;
    return decorator;
  };

  decorator.Path = (path: string) => {
    options.path = path;
    return decorator;
  };

  decorator.Method = (method: string) => {
    options.method = method;
    return decorator;
  };

  return decorator;
}

/**
 * @param path
 * @decorators
 * @ignore
 */
export function Get(path: string = "/") {
  return Lambda().Path(path).Method(OperationMethods.GET);
}

/**
 * @param path
 * @decorators
 * @ignore
 */
export function Post(path: string = "/") {
  return Lambda().Path(path).Method(OperationMethods.POST);
}

/**
 * @param path
 * @decorators
 * @ignore
 */
export function Put(path: string = "/") {
  return Lambda().Path(path).Method(OperationMethods.PUT);
}

/**
 * @param path
 * @decorators
 * @ignore
 */
export function Patch(path: string = "/") {
  return Lambda().Path(path).Method(OperationMethods.PATCH);
}

/**
 * @param path
 * @decorators
 * @ignore
 */
export function Delete(path: string = "/") {
  return Lambda().Path(path).Method(OperationMethods.DELETE);
}
