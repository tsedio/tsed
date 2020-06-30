import {
  ancestorsOf,
  deepExtends,
  descriptorOf,
  Enumerable,
  isArrayOrArrayClass,
  isFunction,
  isPromise,
  Metadata,
  nameOf,
  prototypeOf,
  Storable,
  Store,
  Type
} from "@tsed/core";
import {IPathMethod} from "../interfaces/IPathMethod";
import {IResponseOptions} from "../interfaces/IResponseOptions";
import {ParamMetadata} from "./ParamMetadata";

export interface EndpointConstructorOptions {
  target: Type<any>;
  propertyKey: string | symbol;
  descriptor: PropertyDescriptor;
  beforeMiddlewares?: Function[];
  middlewares?: Function[];
  afterMiddlewares?: Function[];
  pathsMethods?: IPathMethod[];
  type?: any;
  responses?: Map<number, IResponseOptions>;
  statusCode?: number;
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
export class EndpointMetadata extends Storable implements EndpointConstructorOptions {
  provide: Type<any>;
  // LIFECYCLE
  @Enumerable()
  public beforeMiddlewares: any[] = [];

  @Enumerable()
  public middlewares: any[] = [];

  @Enumerable()
  public afterMiddlewares: any[] = [];
  /**
   * Route strategy.
   */
  @Enumerable()
  public pathsMethods: IPathMethod[] = [];

  @Enumerable()
  readonly responses: Map<number, IResponseOptions> = new Map();

  @Enumerable()
  public statusCode: number = 200;

  constructor(options: EndpointConstructorOptions) {
    super(options.target, options.propertyKey, options.descriptor || Object.getOwnPropertyDescriptor(options.target, options.propertyKey));

    const {
      target,
      statusCode,
      responses,
      propertyKey,
      beforeMiddlewares = [],
      middlewares = [],
      afterMiddlewares = [],
      pathsMethods = [],
      type
    } = options;

    this.provide = target;
    this._type = Metadata.getReturnType(target, propertyKey);
    this.after(afterMiddlewares);
    this.before(beforeMiddlewares);
    this.use(middlewares);

    this.pathsMethods = pathsMethods;
    this.type = type;
    statusCode && (this.statusCode = statusCode);

    if (responses) {
      this.responses = responses;
    } else {
      this.responses.set(this.statusCode, {
        code: this.statusCode
      } as any);
    }
  }

  get type(): Type<any> {
    return isPromise(this._type) || isArrayOrArrayClass(this._type) || this._type === Object ? undefined! : this._type;
  }

  set type(type: Type<any>) {
    this._type = type;
  }

  get targetName(): string {
    return nameOf(this.provide);
  }

  get params() {
    return ParamMetadata.getParams(this.target, this.propertyKey);
  }

  get response() {
    return this.responses.get(this.statusCode)!;
  }

  /**
   * Get all endpoints from a given class and his parents.
   * @param {Type<any>} target
   * @returns {EndpointMetadata[]}
   */
  static getEndpoints(target: Type<any>): EndpointMetadata[] {
    const map = new Map();

    const set = (base: any) => {
      const store = Store.from(base);
      if (store.has("endpoints")) {
        store.get("endpoints").forEach((endpoint: EndpointMetadata) => {
          endpoint = endpoint.clone();
          endpoint.provide = target;

          map.set(endpoint.propertyKey, endpoint);
        });
      }
    };

    set(target);
    ancestorsOf(target).forEach(set);

    return Array.from(map.values());
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   * @param descriptor
   */
  static get(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor): EndpointMetadata {
    descriptor = descriptor === undefined ? descriptorOf(prototypeOf(target), "test") : descriptor;
    const store = Store.from(target);
    const endpoints = store.get("endpoints") || new Map();
    store.set("endpoints", endpoints);

    if (!endpoints.has(propertyKey)) {
      endpoints.set(propertyKey, new EndpointMetadata({target, propertyKey, descriptor}));
    }

    return store.get("endpoints").get(propertyKey);
  }

  /**
   * Gets a value indicating whether the target object or its prototype chain has already method registered.
   * @param target
   * @param method
   * @deprecated
   */
  /* istanbul ignore next */
  static has(target: Type<any>, method: string | symbol): boolean {
    return Store.from(target).get("endpoints").has(method);
  }

  /**
   * Append mvc in the pool (before).
   * @param target
   * @param targetKey
   * @param args
   * @deprecated
   */
  /* istanbul ignore next */
  static useBefore(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey, descriptorOf(target, targetKey)).before(args);

    return this;
  }

  /**
   * Add middleware and configuration for the endpoint.
   * @param target
   * @param targetKey
   * @param args
   * @returns {Endpoint}
   * @deprecated
   */
  /* istanbul ignore next */
  static use(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey, descriptorOf(target, targetKey)).use(args);

    return this;
  }

  /**
   * Append mvc in the pool (after).
   * @param target
   * @param targetKey
   * @param args
   * @deprecated
   */
  /* istanbul ignore next */
  static useAfter(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey, descriptorOf(target, targetKey)).after(args);

    return this;
  }

  /**
   * Find the a value at the controller level. Let this value be extended or overridden by the endpoint itself.
   *
   * @param key
   * @returns {any}
   */
  get(key: any) {
    const ctrlValue = Store.from(this.target).get(key);
    let meta = deepExtends(undefined, ctrlValue);
    const endpointValue = this.store.get(key);
    if (endpointValue !== undefined) {
      meta = deepExtends(meta, endpointValue);
    }

    return meta;
  }

  /**
   * Change the type and the collection type from the status code.
   * @param {string | number} code
   * @deprecated Use endpoint.responses.get(code)
   */
  public statusResponse(code: string | number) {
    if (code && this.responses.has(+code)) {
      const {type, collectionType} = this.responses.get(+code)!;
      this.type = type;
      this.collectionType = collectionType;
    } else {
      const {type, collectionType} = this.responses.get(this.statusCode) || {};
      this.type = type;
      this.collectionType = collectionType;
    }

    return this.responses.get(+code) || {};
  }

  /**
   *
   * @param args
   * @returns {EndpointMetadata}
   */
  public before(args: Function[]): this {
    this.beforeMiddlewares = this.beforeMiddlewares.concat(args).filter(isFunction);

    return this;
  }

  /**
   *
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

  /**
   * Store all arguments collected via Annotation.
   * @param args
   * @deprecated
   */
  /* istanbul ignore next */
  public merge(args: any[]): this {
    return this.use(args);
  }

  public clone() {
    return new EndpointMetadata({
      target: this.target,
      propertyKey: this.propertyKey,
      descriptor: this.descriptor,
      beforeMiddlewares: this.beforeMiddlewares,
      middlewares: this.middlewares,
      afterMiddlewares: this.afterMiddlewares,
      pathsMethods: this.pathsMethods,
      type: this.type,
      responses: this.responses,
      statusCode: this.statusCode
    });
  }
}
