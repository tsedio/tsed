import {
  ancestorsOf,
  DecoratorTypes,
  isArrayOrArrayClass,
  isArrowFn,
  isClass,
  isClassObject,
  isCollection,
  isDate,
  isObject,
  isPlainObject,
  isPrimitiveOrPrimitiveClass,
  nameOf,
  Store,
  Type
} from "@tsed/core";

import type {JsonClassStore} from "./JsonClassStore.js";
import {getJsonEntityStore} from "./JsonEntitiesContainer.js";
import type {JsonMethodStore} from "./JsonMethodStore.js";
import type {JsonParameterStore} from "./JsonParameterStore.js";
import type {JsonPropertyStore} from "./JsonPropertyStore.js";
import type {JsonSchema} from "./JsonSchema.js";

/**
 * Configuration options for creating a JsonEntityStore.
 *
 * @public
 */
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

/**
 * Base class for storing metadata about decorated entities (classes, properties, methods, parameters).
 *
 * JsonEntityStore is the foundation of Ts.ED's metadata system, managing schema information
 * and type metadata for decorated entities. It serves as the parent class for specialized
 * stores (JsonClassStore, JsonPropertyStore, JsonMethodStore, JsonParameterStore).
 *
 * ### Entity Types
 *
 * Different decorator types create different store subclasses:
 * - **Class decorators**: Create JsonClassStore instances
 * - **Property decorators**: Create JsonPropertyStore instances
 * - **Method decorators**: Create JsonMethodStore instances
 * - **Parameter decorators**: Create JsonParameterStore instances
 *
 * ### Key Responsibilities
 *
 * - **Schema Management**: Each store maintains a JsonSchema for the decorated entity
 * - **Type Resolution**: Resolves TypeScript types, including collections and generics
 * - **Metadata Storage**: Stores decorator metadata using Ts.ED's Store system
 * - **Inheritance**: Manages parent-child relationships between entities
 *
 * ### Usage
 *
 * Stores are typically accessed via static `from()` methods:
 *
 * ```typescript
 * // Get store for a class
 * const classStore = getJsonEntityStore(MyClass);
 *
 * // Get store for a property
 * const propStore = getJsonEntityStore(MyClass, "propertyName");
 *
 * // Get store for a method parameter
 * const paramStore = getJsonEntityStore(MyClass, "methodName", 0);
 * ```
 *
 * ### Architecture
 *
 * The store system creates a hierarchical structure:
 * - ClassStore contains PropertyStore and MethodStore children
 * - MethodStore contains ParameterStore children
 * - Each store has an associated JsonSchema
 *
 * @public
 */
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
  public token: Type<any>;
  readonly store: Store;
  readonly isStore = true;
  readonly parent: JsonEntityStore;
  readonly target: Type<any>;

  [key: string]: any;

  constructor(options: JsonEntityStoreOptions) {
    const {target, propertyKey, descriptor, index, decoratorType} = options;
    this.target = target;
    this.propertyKey = propertyKey!;
    this.propertyName = propertyKey ? String(propertyKey) : propertyKey || "";
    this.descriptor = descriptor;
    this.index = index!;
    this.decoratorType = decoratorType;
    this.token = target;
    this.store = options.store;
    this.parent = this;
  }

  /**
   * Type of the collection (Array, Map, Set, etc...)
   */
  private _collectionType!: Type<any>;

  get collectionType(): Type<any> | undefined {
    return this._collectionType;
  }

  set collectionType(value: Type<any>) {
    this._collectionType = value;
  }

  /**
   *
   */
  protected _type!: Type<any>;

  get type(): Type<any> | any {
    return this._type;
  }

  /**
   * Get original type without transformation
   * @param value
   */
  set type(value: Type<any> | any) {
    if (!value?.$schema?.skip) {
      this._type = value;
    }

    this.build();
  }

  /**
   * Ref to JsonSchema
   */
  protected _schema!: JsonSchema;

  /**
   * Return the JsonSchema
   */
  get schema(): JsonSchema {
    return this._schema;
  }

  /**
   * Return the class name of the entity.
   * @returns {string}
   */
  get targetName(): string {
    return nameOf(this.token);
  }

  get isCollection(): boolean {
    return !!this._collectionType;
  }

  get isArray() {
    return isArrayOrArrayClass(this._collectionType);
  }

  get discriminatorAncestor(): JsonEntityStore | undefined {
    const ancestors = ancestorsOf(this.target);
    const ancestor = ancestors.find((ancestor) => getJsonEntityStore(ancestor).schema.isDiscriminator);
    return ancestor && getJsonEntityStore(ancestor);
  }

  get isPrimitive() {
    return isPrimitiveOrPrimitiveClass(this.type);
  }

  get isDate() {
    return isDate(this.computedType);
  }

  get isObject() {
    return isObject(this.computedType);
  }

  get isClass() {
    return isClass(this.computedType);
  }

  /**
   * Return the itemSchema computed type. if the type is a function used for recursive model, the function will be called to
   * get the right type.
   */
  get computedType() {
    return this.itemSchema.class;
  }

  get itemSchema(): JsonSchema {
    return this.isCollection ? this.schema.itemSchema() : this.schema;
  }

  get parentSchema(): JsonSchema {
    return this.parent.schema;
  }

  get isDiscriminatorChild() {
    return this.schema.isDiscriminator && this.discriminatorAncestor?.schema.discriminator().base !== this.target;
  }

  get path() {
    return this.store.get("path");
  }

  set path(path: string) {
    this.store.set("path", path);
  }

  isGetterOnly() {
    return isObject(this.descriptor) && !this.descriptor.value && this.descriptor.get && !this.descriptor.set;
  }

  get<T = any>(key: string, defaultValue?: any) {
    return this.store.get<T>(key, defaultValue);
  }

  set(key: string, value?: any) {
    return this.store.set(key, value);
  }

  toString() {
    return [this.targetName, this.propertyName, this.index].filter((o) => o !== undefined).join(":");
  }

  getBestType() {
    return this.itemSchema.hasDiscriminator
      ? this.itemSchema.discriminator().base
      : isClassObject(this.type)
        ? this.itemSchema.getTarget()
        : isArrowFn(this.type)
          ? this.type()
          : this.type;
  }

  is(input: DecoratorTypes.CLASS): this is JsonClassStore;
  is(input: DecoratorTypes.PROP): this is JsonPropertyStore;
  is(input: DecoratorTypes.METHOD): this is JsonMethodStore;
  is(input: DecoratorTypes.PARAM): this is JsonParameterStore;
  is(input: DecoratorTypes): boolean {
    return this.decoratorType === input;
  }

  abstract build(): void;

  protected buildType(type: any) {
    if (isCollection(type)) {
      this._collectionType = type;
    } else if (!(type && "$schema" in type && type.$schema.skip)) {
      this._type = type;

      // issue #1534: Enum metadata stored as plain object instead of String (see: https://github.com/tsedio/tsed/issues/1534)
      if (this._type && isPlainObject(this._type)) {
        this._type = String;
      }
    }
  }
}
