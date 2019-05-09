import {deepExtends, isArrayOrArrayClass, isPromise, Metadata, NotEnumerable, Storable, Store, Type} from "@tsed/core";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {EXPRESS_METHODS} from "../constants";
import {IPathMethod} from "../interfaces/IPathMethod";
import {PathParamsType} from "../interfaces/PathParamsType";

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
export class EndpointMetadata extends Storable {
  // LIFECYCLE
  public beforeMiddlewares: any[] = [];
  public middlewares: any[] = [];
  public afterMiddlewares: any[] = [];
  /**
   * Route strategy.
   */
  public pathsMethods: IPathMethod[] = [];
  /**
   * Endpoint inherited from parent class.
   */
  @NotEnumerable()
  private inheritedEndpoint: EndpointMetadata;

  constructor(_provide: Type<any>, private _methodClassName: string | symbol) {
    super(_provide, _methodClassName, Object.getOwnPropertyDescriptor(_provide, _methodClassName));

    this._type = Metadata.getReturnType(this._target, this.methodClassName);
  }

  /**
   *
   * @deprecated pathsMethods
   * @returns {string}
   */
  get httpMethod(): string {
    return this.pathsMethods[0] && this.pathsMethods[0].method!;
  }

  /**
   *
   * @deprecated
   * @param value
   */
  set httpMethod(value: string) {
    if (!this.pathsMethods[0]) {
      this.pathsMethods[0] = {} as any;
    }

    this.pathsMethods[0].method = value;
  }

  /**
   *
   * @deprecated use pathsMethods instead of.
   * @returns {PathParamsType}
   */
  get path(): PathParamsType {
    return this.pathsMethods[0] && this.pathsMethods[0].path!;
  }

  /**
   *
   * @deprecated
   * @param value
   */
  set path(value: PathParamsType) {
    if (!this.pathsMethods[0]) {
      this.pathsMethods[0] = {} as any;
    }
    this.pathsMethods[0].path = value;
  }

  get type(): Type<any> {
    return isPromise(this._type) || isArrayOrArrayClass(this._type) || this._type === Object ? undefined! : this._type;
  }

  set type(type: Type<any>) {
    this._type = type;
  }

  /**
   *
   */
  get methodClassName(): string {
    return String(this._methodClassName);
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
    return ParamRegistry.getParams(this.target, this.methodClassName);
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
    const metadata = new EndpointMetadata(target, this.methodClassName);
    metadata.inheritedEndpoint = this;
    metadata.middlewares = this.middlewares;
    metadata.afterMiddlewares = this.afterMiddlewares;
    metadata.beforeMiddlewares = this.beforeMiddlewares;
    metadata.pathsMethods = metadata.pathsMethods;
    metadata.httpMethod = this.httpMethod;
    metadata.path = this.path;
    metadata.type = this._type;

    return metadata;
  }
}
