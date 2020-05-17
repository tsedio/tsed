import {deepExtends, Enumerable, isArrayOrArrayClass, isPromise, Metadata, NotEnumerable, Storable, Store, Type} from "@tsed/core";
import {EXPRESS_METHODS} from "../constants";
import {IPathMethod} from "../interfaces/IPathMethod";
import {IResponseOptions} from "../interfaces/IResponseOptions";
import {ParamRegistry} from "../registries/ParamRegistry";

export interface EndpointConstructorOptions {
  target: Type<any>;
  propertyKey: string | symbol;
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
    super(options.target, options.propertyKey, Object.getOwnPropertyDescriptor(options.target, options.propertyKey));

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
