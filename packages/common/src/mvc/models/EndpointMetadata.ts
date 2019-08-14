import {deepExtends, Enumerable, isArrayOrArrayClass, isPromise, Metadata, NotEnumerable, Storable, Store, Type} from "@tsed/core";
import {EXPRESS_METHODS} from "../constants";
import {IPathMethod} from "../interfaces/IPathMethod";
import {ParamRegistry} from "../registries/ParamRegistry";

export interface EndpointConstructorOptions {
  target: Type<any>;
  propertyKey: string | symbol;
  beforeMiddlewares?: any[];
  middlewares?: any[];
  afterMiddlewares?: any[];
  pathsMethods?: IPathMethod[];
  type?: any;
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
  /**
   * Endpoint inherited from parent class.
   */
  @NotEnumerable()
  private inheritedEndpoint: EndpointMetadata;

  constructor(options: EndpointConstructorOptions) {
    super(options.target, options.propertyKey, Object.getOwnPropertyDescriptor(options.target, options.propertyKey));

    const {target, propertyKey, beforeMiddlewares = [], middlewares = [], afterMiddlewares = [], pathsMethods = [], type} = options;

    this._type = Metadata.getReturnType(target, propertyKey);

    this.beforeMiddlewares = beforeMiddlewares;
    this.middlewares = middlewares;
    this.afterMiddlewares = afterMiddlewares;
    this.pathsMethods = pathsMethods;
    this.type = type;
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
    return this.inheritedEndpoint ? this.inheritedEndpoint.store : this._store;
  }

  get statusCode() {
    return this.store.get("statusCode") || 200;
  }

  get params() {
    return ParamRegistry.getParams(this.target, this.propertyKey);
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
   */
  public statusResponse(code: string | number): {description: string; headers: any; examples: any} {
    const get = (code: number | string) => (this.get("responses") || {})[code] || {};
    let {description, headers, examples} = get(code);

    if (code) {
      const {type, collectionType} = get(code);
      this.type = type;
      this.collectionType = collectionType;
    }

    const expectedStatus = this.statusCode;

    if (+code === +expectedStatus) {
      const response = this.store.get("response");

      if (response) {
        headers = response.headers || headers;
        examples = response.examples || examples;
        description = response.description || description;

        this.type = response.type || this.type;
        this.collectionType = response.collectionType || this.collectionType;
      }
    }

    if (headers) {
      headers = deepExtends({}, headers);
      Object.keys(headers).forEach(key => {
        delete headers[key].value;
      });
    }

    return {
      headers,
      examples,
      description
    };
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

  /**
   *
   * @param {Type<any>} target
   */
  public inherit(target: Type<any>): EndpointMetadata {
    const metadata = new EndpointMetadata({
      ...this,
      target,
      type: this._type
    });

    metadata.inheritedEndpoint = this;

    return metadata;
  }
}
