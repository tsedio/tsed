import {DecoratorTypes, deepMerge, descriptorOf, isCollection, isFunction, isPromise, Metadata, prototypeOf, Store, Type} from "@tsed/core";

import {JsonEntityComponent} from "../decorators/config/jsonEntityComponent.js";
import type {JsonClassStore} from "./JsonClassStore.js";
import {JsonEntityStore, JsonEntityStoreOptions} from "./JsonEntityStore.js";
import {JsonOperation} from "./JsonOperation.js";
import type {JsonParameterStore} from "./JsonParameterStore.js";
import {JsonSchema} from "./JsonSchema.js";

export interface JsonViewOptions {
  path: string;
  options: any;
}

export interface JsonRedirectOptions {
  status: number | undefined;
  url: string;
}

@JsonEntityComponent(DecoratorTypes.METHOD)
export class JsonMethodStore extends JsonEntityStore {
  readonly parent: JsonClassStore = JsonEntityStore.from(this.target);
  public middlewares: any[] = [];
  public beforeMiddlewares: any[] = [];
  public afterMiddlewares: any[] = [];
  /**
   * Ref to JsonOperation when the decorated object is a method.
   */
  readonly operation: JsonOperation = new JsonOperation();
  /**
   * List of children JsonEntityStore (properties or methods or params)
   */
  readonly children: Map<string | number, JsonParameterStore> = new Map();

  constructor(options: JsonEntityStoreOptions) {
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

  get params(): JsonParameterStore[] {
    return this.parameters;
  }

  get view(): JsonViewOptions {
    return this.store.get("view") as JsonViewOptions;
  }

  set view(view: JsonViewOptions) {
    this.store.set("view", view);
  }

  get acceptMimes(): string[] {
    return this.store.get<string[]>("acceptMimes", []);
  }

  set acceptMimes(mimes: string[]) {
    this.store.set("acceptMimes", mimes);
  }

  get parameters(): JsonParameterStore[] {
    return [...this.children.values()] as JsonParameterStore[];
  }

  get operationPaths() {
    return this.operation.operationPaths;
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   * @param descriptor
   */
  static get(target: Type<any>, propertyKey: string | symbol, descriptor?: PropertyDescriptor): JsonMethodStore {
    descriptor = descriptor || descriptorOf(prototypeOf(target), propertyKey);

    return JsonEntityStore.from<JsonMethodStore>(prototypeOf(target), propertyKey, descriptor);
  }

  getResponseOptions(
    status: number,
    {contentType = "application/json", includes}: {contentType?: string; includes?: string[]} = {}
  ): undefined | any {
    const media = this.operation.getResponseOf(status).getMedia(contentType, false);

    if (media && media.has("schema")) {
      const schema = media.get("schema") as JsonSchema;
      let groups = media.groups;

      if (includes && media.allowedGroups?.size) {
        groups = [...(groups || []), ...includes.filter((include) => media.allowedGroups!.has(include))];
      }

      return {type: schema.getComputedItemType(), groups};
    }

    return {type: this.type};
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

  /**
   * Find the value at the controller level. Let this value be extended or overridden by the endpoint itself.
   *
   * @param key
   * @returns {any}
   */
  public get<T = any>(key: any): T {
    const ctrlValue = Store.from(this.target).get(key);

    return deepMerge<T>(ctrlValue, this.store.get(key));
  }

  public getParamTypes(): Record<string, boolean> {
    return [...this.children.values()].reduce(
      (obj, item) => ({
        ...obj,
        [item.paramType]: true
      }),
      {}
    );
  }

  protected build() {
    if (!this._type) {
      let type: any = Metadata.getReturnType(this.target, this.propertyKey);
      type = isPromise(type) ? undefined : type;

      this.buildType(type);
    }

    this._type = this._type || Object;

    this.parent.children.set(this.propertyName, this);

    if (isCollection(this._type)) {
      this.collectionType = this._type;
      // @ts-ignore
      delete this._type;
    }

    this._schema = JsonSchema.from({
      type: this.collectionType || this.type
    });

    if (this.collectionType) {
      this._schema.itemSchema(this.type);
    }

    this.parent.schema.addProperty(this.propertyName, this.schema);
  }
}

/**
 * EndpointMetadata contains metadata about a controller and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored into endpoint.
 * EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *```typescript
 * @Controller("/my-path")
 * provide MyClass {
 *
 *     @Get("/")
 *     @Authenticated()
 *     public myMethod(){}
 * }
 *```
 *
 * @alias JsonMethodStore
 */
export type EndpointMetadata = JsonMethodStore;
export const EndpointMetadata = JsonMethodStore;
