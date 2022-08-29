import {
  classOf,
  decoratorTypeOf,
  DecoratorTypes,
  descriptorOf,
  isArrayOrArrayClass,
  isClass,
  isCollection,
  isDate,
  isObject,
  isPlainObject,
  isPrimitiveOrPrimitiveClass,
  nameOf,
  prototypeOf,
  Store,
  Type
} from "@tsed/core";
import type {JsonSchema} from "./JsonSchema";
import type {JsonMethodStore} from "./JsonMethodStore";
import type {JsonClassStore} from "./JsonClassStore";
import type {JsonPropertyStore} from "./JsonPropertyStore";
import type {JsonParameterStore} from "./JsonParameterStore";

/**
 * @ignore
 */
export const JsonEntitiesContainer = new Map<DecoratorTypes, Type<JsonEntityStore>>();

export interface JsonEntityStoreOptions {
  decoratorType: DecoratorTypes;
  target: Type<any>;
  propertyKey?: string | symbol;
  index?: number;
  descriptor?: any;
  type?: Type<any>;
  collectionType?: Type<any>;
  beforeMiddlewares?: Function[];
  middlewares?: Function[];
  afterMiddlewares?: Function[];

  [key: string]: any;
}

export abstract class JsonEntityStore implements JsonEntityStoreOptions {
  /**
   * Original property key decorated by the decorator
   */
  readonly propertyKey: string | symbol;
  /**
   * Alias of the property
   */
  readonly propertyName: string;
  /**
   * Parameter index
   */
  readonly index: number;
  /**
   * Method's descriptor
   */
  readonly descriptor: PropertyDescriptor;
  /**
   * Decorator type used to declare the JsonSchemaStore.
   */
  readonly decoratorType: DecoratorTypes;
  /**
   * Type of the collection (Array, Map, Set, etc...)
   */
  public collectionType: Type<any>;
  public token: Type<any>;
  readonly store: Store;
  readonly isStore = true;
  readonly parent: JsonEntityStore;
  readonly target: Type<any>;
  /**
   *
   */
  protected _type: Type<any>;
  /**
   * Ref to JsonSchema
   */
  protected _schema: JsonSchema;

  [key: string]: any;

  constructor(options: JsonEntityStoreOptions) {
    const {target, propertyKey, descriptor, index, decoratorType} = options;
    this.target = target;
    this.propertyKey = propertyKey!;
    this.propertyName = String(propertyKey);
    this.descriptor = descriptor;
    this.index = index!;
    this.decoratorType = decoratorType;
    this.token = target;
    this.store = options.store;
    this.parent = this;
  }

  isGetterOnly() {
    return isObject(this.descriptor) && !this.descriptor.value && this.descriptor.get && !this.descriptor.set;
  }
  /**
   * Return the class name of the entity.
   * @returns {string}
   */
  get targetName(): string {
    return nameOf(this.token);
  }

  /**
   *
   * @returns {boolean}
   */
  get isCollection(): boolean {
    return !!this.collectionType;
  }

  /**
   *
   * @returns {boolean}
   */
  get isArray() {
    return isArrayOrArrayClass(this.collectionType);
  }

  /**
   *
   * @returns {boolean}
   */
  get isPrimitive() {
    return isPrimitiveOrPrimitiveClass(this._type);
  }

  /**
   *
   * @returns {boolean}
   */
  get isDate() {
    return isDate(this.computedType);
  }

  /**
   *
   * @returns {boolean}
   */
  get isObject() {
    return isObject(this.computedType);
  }

  /**
   *
   */
  get isClass() {
    return isClass(this.computedType);
  }

  /**
   * Return the JsonSchema
   */
  get schema(): JsonSchema {
    return this._schema;
  }

  get nestedGenerics(): Type<any>[][] {
    return this.schema.nestedGenerics;
  }

  set nestedGenerics(nestedGenerics: Type<any>[][]) {
    this.schema.nestedGenerics = nestedGenerics;
  }

  /**
   *
   * @returns {Type<any>}
   */
  get type(): Type<any> | any {
    return this._type;
  }

  /**
   * Get original type without transformation
   * @param value
   */
  set type(value: Type<any> | any) {
    this._type = value;
    this.build();
  }

  /**
   * Return the itemSchema computed type. if the type is a function used for recursive model, the function will be called to
   * get the right type.
   */
  get computedType() {
    return this.itemSchema.getComputedType();
  }

  get itemSchema(): JsonSchema {
    return this.isCollection ? this.schema.itemSchema() : this.schema;
  }

  get parentSchema(): JsonSchema {
    return this.parent.schema;
  }

  /**
   *
   * @param target
   */
  static from<T extends JsonClassStore = JsonClassStore>(target: Type<any>): T;
  static from<T extends JsonPropertyStore = JsonPropertyStore>(target: Type<any> | any, propertyKey: string | symbol): T;
  static from<T extends JsonParameterStore = JsonParameterStore>(target: Type<any> | any, propertyKey: string | symbol, index: number): T;
  static from<T extends JsonMethodStore = JsonMethodStore>(
    target: Type<any> | any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): T;
  static from<T extends JsonEntityStore = JsonEntityStore>(...args: any[]): T;
  static from<T extends JsonEntityStore = JsonEntityStore>(...args: any[]): T {
    if (args[0].isStore) {
      return args[0] as T;
    }

    const target = args[0];

    if (args.length > 1) {
      args[0] = prototypeOf(args[0]);
    }

    const store = Store.from(...args);

    if (!store.has("JsonEntityStore")) {
      const decoratorType = decoratorTypeOf(args);
      const entityStore = JsonEntitiesContainer.get(decoratorType);

      // istanbul ignore next
      if (!entityStore) {
        throw Error("Unsupported json entity type");
      }

      const jsonSchemaStore = new entityStore({
        store,
        decoratorType,
        target: classOf(target),
        propertyKey: args[1],
        index: typeof args[2] === "number" ? args[2] : undefined,
        descriptor: typeof args[2] === "object" ? args[2] : undefined
      });

      jsonSchemaStore.build();

      store.set("JsonEntityStore", jsonSchemaStore);
    }

    return store.get<T>("JsonEntityStore")!;
  }

  static fromMethod<T extends JsonMethodStore = JsonMethodStore>(target: any, propertyKey: string | symbol) {
    return this.from<T>(target, propertyKey, descriptorOf(target, propertyKey));
  }

  get<T = any>(key: string, defaultValue?: any) {
    return this.store.get<T>(key, defaultValue);
  }

  set(key: string, value?: any) {
    return this.store.set(key, value);
  }

  protected abstract build(): void;

  protected buildType(type: any) {
    if (isCollection(type)) {
      this.collectionType = type;
    } else {
      this._type = type;

      // issue #1534: Enum metadata stored as plain object instead of String (see: https://github.com/tsedio/tsed/issues/1534)
      if (this._type && isPlainObject(this._type)) {
        this._type = String;
      }
    }
  }
}
