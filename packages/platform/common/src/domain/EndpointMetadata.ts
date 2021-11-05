import {DecoratorTypes, deepMerge, descriptorOf, isFunction, nameOf, prototypeOf, Store, Type} from "@tsed/core";
import {ParamMetadata} from "@tsed/platform-params";
import {JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonOperation} from "@tsed/schema";

export interface EndpointConstructorOptions extends JsonEntityStoreOptions {
  beforeMiddlewares?: Function[];
  middlewares?: Function[];
  afterMiddlewares?: Function[];
}

export interface EndpointViewOptions {
  path: string;
  options: any;
}

export interface EndpointRedirectOptions {
  status: number | undefined;
  url: string;
}

/**
 * EndpointMetadata contains metadata about a controller and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    provide MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 */
@JsonEntityComponent(DecoratorTypes.METHOD)
export class EndpointMetadata extends JsonEntityStore implements EndpointConstructorOptions {
  public beforeMiddlewares: any[] = [];
  public middlewares: any[] = [];
  public afterMiddlewares: any[] = [];

  constructor(options: EndpointConstructorOptions) {
    super({
      store: Store.fromMethod(options.target, options.propertyKey!),
      descriptor: descriptorOf(options.target, options.propertyKey!),
      ...options
    });

    const {beforeMiddlewares = [], middlewares = [], afterMiddlewares = []} = options;

    this.after(afterMiddlewares);
    this.before(beforeMiddlewares);
    this.use(middlewares);
  }

  get targetName(): string {
    return nameOf(this.token);
  }

  get params(): ParamMetadata[] {
    return (Array.from(this.children.values()) as unknown) as ParamMetadata[];
  }

  /**
   * Return the JsonOperation
   */
  get operation(): JsonOperation {
    return this._operation;
  }

  get operationPaths() {
    return this.operation.operationPaths;
  }

  get view(): EndpointViewOptions {
    return this.store.get("view") as EndpointViewOptions;
  }

  set view(view: EndpointViewOptions) {
    this.store.set("view", view);
  }

  get acceptMimes(): string[] {
    return this.store.get<string[]>("acceptMimes", []);
  }

  set acceptMimes(mimes: string[]) {
    this.store.set("acceptMimes", mimes);
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   * @param descriptor
   */
  static get(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor): EndpointMetadata {
    descriptor = descriptor || descriptorOf(prototypeOf(target), propertyKey);

    return JsonEntityStore.from<EndpointMetadata>(prototypeOf(target), propertyKey, descriptor);
  }

  addOperationPath(method: string, path: string | RegExp, options: any = {}) {
    return this.operation.addOperationPath(method, path, options);
  }

  /**
   * Find the a value at the controller level. Let this value be extended or overridden by the endpoint itself.
   *
   * @param key
   * @returns {any}
   */
  get<T = any>(key: any): T {
    const ctrlValue = Store.from(this.target).get(key);

    return deepMerge<T>(ctrlValue, this.store.get(key));
  }

  /**
   * Append middlewares to the beforeMiddlewares list.
   * @param args
   * @returns {EndpointMetadata}
   */
  public before(args: Function[]): this {
    this.beforeMiddlewares = this.beforeMiddlewares.concat(args).filter(isFunction);

    return this;
  }

  /**
   * Append middlewares to the afterMiddlewares list.
   * @param args
   * @returns {EndpointMetadata}
   */
  public after(args: Function[]): this {
    this.afterMiddlewares = this.afterMiddlewares.concat(args).filter(isFunction);

    return this;
  }

  /**
   * Store all arguments collected via Annotation.
   * @param args
   */
  public use(args: Function[]) {
    this.middlewares = this.middlewares.concat(args).filter(isFunction);

    return this;
  }
}
