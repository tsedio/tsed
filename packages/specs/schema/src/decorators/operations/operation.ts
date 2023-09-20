import {OperationVerbs} from "../../constants/OperationVerbs";
import {DecoratorContext} from "../../domain/DecoratorContext";
import {JsonMethodStore} from "../../domain/JsonMethodStore";
import {mapOperationOptions} from "../../utils/mapOperationOptions";

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
  Method(method: OperationVerbs | string): this;

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

class OperationDecoratorContext extends DecoratorContext<RouteChainedDecorators> {
  readonly methods: string[] = ["name", "description", "summary", "method", "id", "use", "useAfter", "useBefore"];
  protected declare entity: JsonMethodStore;

  protected beforeInit() {
    const path: string = this.get("path");
    const method: string = OperationVerbs[this.get("method") as OperationVerbs] || OperationVerbs.CUSTOM;

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
export function Operation(method: string, path: string, ...args: any[]): RouteChainedDecorators;
export function Operation(...args: any[]): RouteChainedDecorators;
export function Operation(...args: any[]): RouteChainedDecorators {
  const routeOptions = mapOperationOptions(args);

  const context = new OperationDecoratorContext(routeOptions);

  return context.build();
}
