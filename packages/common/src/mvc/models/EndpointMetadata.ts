import {
  deepExtends,
  descriptorOf,
  Enumerable,
  getInheritedClass,
  isArrayOrArrayClass,
  isPromise,
  Metadata,
  NotEnumerable,
  prototypeOf,
  Storable,
  Store,
  Type
} from "@tsed/core";
import {EXPRESS_METHODS} from "../constants";
import {IPathMethod} from "../interfaces/IPathMethod";
import {IResponseOptions} from "../interfaces/IResponseOptions";
import {ParamRegistry} from "../registries/ParamRegistry";

export interface EndpointConstructorOptions {
  target: Type<any>;
  propertyKey: string | symbol;
  descriptor: PropertyDescriptor;
  beforeMiddlewares?: any[];
  middlewares?: any[];
  afterMiddlewares?: any[];
  pathsMethods?: IPathMethod[];
  type?: any;
  parent?: EndpointMetadata;
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
  /**
   * Endpoint inherited from parent class.
   */
  @NotEnumerable()
  readonly parent: EndpointMetadata | undefined;

  constructor(options: EndpointConstructorOptions) {
    super(options.target, options.propertyKey, options.descriptor || Object.getOwnPropertyDescriptor(options.target, options.propertyKey));

    const {
      target,
      parent,
      statusCode,
      responses,
      propertyKey,
      beforeMiddlewares = [],
      middlewares = [],
      afterMiddlewares = [],
      pathsMethods = [],
      type
    } = options;

    this._type = Metadata.getReturnType(target, propertyKey);

    this.beforeMiddlewares = beforeMiddlewares;
    this.middlewares = middlewares;
    this.afterMiddlewares = afterMiddlewares;
    this.pathsMethods = pathsMethods;
    this.type = type;
    this.parent = parent;
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

  /**
   * @deprecated
   */
  get methodClassName(): string {
    return String(this.propertyKey);
  }

  /**
   *
   * @returns {Store}
   */
  get store(): Store {
    return this.parent ? this.parent.store : this._store;
  }

  get params() {
    return ParamRegistry.getParams(this.target, this.propertyKey);
  }

  get response() {
    return this.responses.get(this.statusCode)!;
  }

  /**
   * Return all endpoints from the given class. This method doesn't return the endpoints from the parent of the given class.
   * @param {Type<any>} target
   * @returns {any}
   * @deprecated
   */
  static getOwnEndpoints(target: Type<any>) {
    if (!this.hasEndpoints(target)) {
      Metadata.set("endpoints", [], target);
    }

    return Metadata.getOwn("endpoints", target);
  }

  /**
   * Get all endpoints from a given class and his parents.
   * @param {Type<any>} target
   * @returns {EndpointMetadata[]}
   * @deprecated
   */
  static getEndpoints(target: Type<any>): EndpointMetadata[] {
    return this.getOwnEndpoints(target).concat(this.inherit(target));
  }

  /**
   * Gets a value indicating whether the target object or its prototype chain has endpoints.
   * @param {Type<any>} target
   * @returns {boolean}
   * @deprecated
   */
  static hasEndpoints(target: Type<any>) {
    return Metadata.hasOwn("endpoints", target);
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   * @param descriptor
   */
  static get(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor): EndpointMetadata {
    descriptor = descriptor === undefined ? descriptorOf(prototypeOf(target), "test") : descriptor;

    if (!this.has(target, propertyKey)) {
      const endpoint = new EndpointMetadata({target, propertyKey, descriptor});
      this.getOwnEndpoints(target).push(endpoint);
      Metadata.set("endpoints", endpoint, target, propertyKey);
    }

    return Metadata.getOwn("endpoints", target, propertyKey);
  }

  /**
   * Gets a value indicating whether the target object or its prototype chain has already method registered.
   * @param target
   * @param method
   */
  static has(target: Type<any>, method: string | symbol): boolean {
    return Metadata.hasOwn("endpoints", target, method);
  }

  /**
   * Append mvc in the pool (before).
   * @param target
   * @param targetKey
   * @param args
   * @deprecated
   */
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
  static useAfter(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey, descriptorOf(target, targetKey)).after(args);

    return this;
  }

  /**
   * Store a data on store manager.
   * @param target
   * @param propertyKey
   * @returns {any}
   * @deprecated
   */
  static store(target: any, propertyKey: string): Store {
    return Store.from(target, propertyKey, descriptorOf(target, propertyKey));
  }

  /**
   * Retrieve all endpoints from inherited class and store it in the registry.
   * @param {Type<any>} ctrlClass
   */
  private static inherit(ctrlClass: Type<any>) {
    const endpoints: EndpointMetadata[] = [];
    let inheritedClass = getInheritedClass(ctrlClass);

    while (inheritedClass && EndpointMetadata.hasEndpoints(inheritedClass)) {
      this.getOwnEndpoints(inheritedClass).forEach((endpoint: EndpointMetadata) => {
        endpoints.push(inheritEndpoint(ctrlClass, endpoint));
      });

      inheritedClass = getInheritedClass(inheritedClass);
    }

    return endpoints;
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
  public before(args: any[]): this {
    this.beforeMiddlewares = this.beforeMiddlewares.concat(args);

    return this;
  }

  /**
   *
   * @param args
   * @returns {EndpointMetadata}
   */
  public after(args: any[]): this {
    this.afterMiddlewares = this.afterMiddlewares.concat(args);

    return this;
  }

  /**
   * Store all arguments collected via Annotation.
   * @param args
   */
  public use(args: any[]) {
    return this.merge(args);
  }

  /**
   * Store all arguments collected via Annotation.
   * @param args
   */
  public merge(args: any[]): this {
    const expressMethods: any = {};

    const filteredArg = args.filter((arg: any) => {
      if (typeof arg === "string" && EXPRESS_METHODS.indexOf(arg) > -1) {
        expressMethods.method = arg;

        return false;
      }

      if (typeof arg === "string" || arg instanceof RegExp) {
        expressMethods.path = arg;

        return false;
      }

      return !!arg;
    });

    if (expressMethods.method || expressMethods.path) {
      this.pathsMethods.push(expressMethods);
    }

    this.middlewares = this.middlewares.concat(filteredArg);

    return this;
  }
}

function inheritEndpoint(target: Type<any>, endpoint: EndpointMetadata): EndpointMetadata {
  return new EndpointMetadata({
    ...endpoint,
    target,
    descriptor: descriptorOf(target, endpoint.propertyKey),
    type: endpoint.type,
    parent: endpoint
  });
}
