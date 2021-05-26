import {classOf, DecoratorTypes, deepExtends, descriptorOf, Enumerable, isFunction, nameOf, prototypeOf, Store, Type} from "@tsed/core";
import {getOperationsStores, JsonEntityComponent, JsonEntityStore, JsonEntityStoreOptions, JsonOperation} from "@tsed/schema";
import {ParamMetadata} from "./ParamMetadata";

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
  // LIFECYCLE
  @Enumerable()
  public beforeMiddlewares: any[] = [];

  @Enumerable()
  public middlewares: any[] = [];

  @Enumerable()
  public afterMiddlewares: any[] = [];

  @Enumerable()
  public statusCode: number = 200;

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

  get location(): string {
    return this.store.get("location") as string;
  }

  set location(url: string) {
    this.store.set("location", url);
  }

  get acceptMimes(): string[] {
    return this.store.get<string[]>("acceptMimes", []);
  }

  set acceptMimes(mimes: string[]) {
    this.store.set("acceptMimes", mimes);
  }

  get redirect(): EndpointRedirectOptions {
    return this.store.get("redirect") as any;
  }

  set redirect(options: EndpointRedirectOptions) {
    this.store.set("redirect", {
      status: 302,
      ...options
    });
  }

  /**
   * Get all endpoints from a given class and his parents.
   * @param {Type<any>} target
   * @returns {EndpointMetadata[]}
   */
  static getEndpoints(target: Type<any>): EndpointMetadata[] {
    const operations = getOperationsStores<EndpointMetadata>(target);

    return Array.from(operations.values()).map((endpoint) => {
      endpoint = endpoint.clone();
      endpoint.token = classOf(target);

      return endpoint;
    });
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

  // static has(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
  //   descriptor = descriptor || descriptorOf(prototypeOf(target), propertyKey);
  //   const store = Store.from(prototypeOf(target), propertyKey, descriptor);
  //
  //   return store.has(JsonEntityStore);
  // }

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
    let meta = deepExtends(undefined, ctrlValue);
    const endpointValue = this.store.get(key);
    if (endpointValue !== undefined) {
      meta = deepExtends(meta, endpointValue);
    }

    return meta;
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

  public clone() {
    const endpoint = new EndpointMetadata({
      ...this,
      target: this.target,
      propertyKey: this.propertyKey,
      descriptor: this.descriptor,
      store: this.store,
      children: this.children
    });

    endpoint.collectionType = this.collectionType;
    endpoint._type = this._type;
    endpoint._operation = this.operation;
    endpoint._schema = this._schema;
    endpoint.middlewares = [...this.middlewares];
    endpoint.afterMiddlewares = [...this.afterMiddlewares];
    endpoint.beforeMiddlewares = [...this.beforeMiddlewares];

    return endpoint;
  }
}
