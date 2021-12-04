import {DecoratorContext} from "../../domain/DecoratorContext";
import {mapRouteOptions} from "../../utils/mapRouteOptions";
import {OperationMethods} from "../../constants/httpMethods";
import {JsonMethodStore} from "../../domain/JsonMethodStore";

export interface RouteChainedDecorators {
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;

  /**
   * @param string
   * @constructor
   */
  Path(string: string): this;

  /**
   * Set the operation method
   * @param method
   */
  Method(method: OperationMethods | string): this;

  /**
   * Set the operation id
   * @param id
   */
  Id(id: string): this;

  /**
   * Set the operation id
   * @param name
   */
  Name(name: string): this;

  /**
   *
   * @param description
   */
  Description(description: string): this;

  /**
   * Summary
   * @constructor
   * @param Summary
   */
  Summary(Summary: string): this;

  Use(...args: any[]): this;

  UseAfter(...args: any[]): this;

  UseBefore(...args: any[]): this;
}

class RouteDecoratorContext extends DecoratorContext<RouteChainedDecorators> {
  readonly methods: string[] = ["name", "description", "summary", "method", "id", "use", "useAfter", "useBefore"];
  protected entity: JsonMethodStore;

  protected beforeInit() {
    const path: string = this.get("path");
    const method: string = OperationMethods[this.get("method") as OperationMethods] || OperationMethods.CUSTOM;

    path && this.entity.operation.addOperationPath(method, path);
  }

  protected onMapKey(key: string, value: any) {
    switch (key) {
      case "name":
      case "id":
        this.entity.operation.operationId(value);
        return;
      case "summary":
        this.entity.operation.summary(value);
        return;
      case "description":
        this.entity.operation.description(value);
        return;
      case "use":
        this.entity.use(value);
        return;
      case "useAfter":
        this.entity.after(value);
        return;
      case "useBefore":
        this.entity.before(value);
        return;
    }

    return super.onMapKey(key, value);
  }
}

/**
 * Describe a new route with a method and path.
 *
 * ```typescript
 * @Controller('/')
 * export class Ctrl {
 *
 *    @Route('GET', '/')
 *    get() { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param method
 * @param path
 * @param args
 * @decorator
 * @operation
 */
export function Route(method: string, path: string, ...args: any[]): RouteChainedDecorators;
export function Route(...args: any[]): RouteChainedDecorators;
export function Route(...args: any[]): RouteChainedDecorators {
  const routeOptions = mapRouteOptions(args);

  const context = new RouteDecoratorContext(routeOptions);

  return context.build();
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function All(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.ALL, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Get(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.GET, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Post(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.POST, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Put(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.PUT, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Delete(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.DELETE, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Head(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.HEAD, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Patch(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.PATCH, path].concat(args));
}

/**
 * This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example, if you placed the following route at the top of all other route definitions, it would require that
 * all routes from that point on would require authentication, and automatically load a user.
 * Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns {Function}
 * @decorator
 * @operation
 * @httpMethod
 */
export function Options(path: string | RegExp | any = "/", ...args: any[]) {
  return Route(...[OperationMethods.OPTIONS, path].concat(args));
}
