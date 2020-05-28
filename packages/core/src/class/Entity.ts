import {Type} from "../interfaces/Type";
import {DecoratorTypes, getDecoratorType} from "../utils/DecoratorUtils";
import {isArrayOrArrayClass, isClass, isDate, isObject, isPrimitiveOrPrimitiveClass, nameOf, nameOfClass} from "../utils/ObjectUtils";

export interface EntityOptions {
  target: Type<any>;
  propertyKey?: string | symbol;
  index?: number;
  descriptor?: any;
  type?: Type<any>;
  collectionType?: Type<any>;

  [key: string]: any;
}

export abstract class Entity {
  /**
   * Original property key decorated by the decorator
   */
  readonly propertyKey: string | symbol | undefined;
  /**
   * Alias of the property
   */
  readonly propertyName: string;
  /**
   * Parameter index
   */
  readonly index: number | undefined;
  /**
   * Method's descriptor
   */
  readonly descriptor: number | undefined;
  /**
   * Decorator type used to declare the JsonSchemaStore.
   */
  readonly decoratorType: DecoratorTypes;
  /**
   * Type of the collection (Array, Map, Set, etc...)
   */
  public collectionType: Type<any>;
  /**
   *
   */
  protected _type: Type<any>;
  protected _target: Type<any>;

  protected constructor({target, propertyKey, descriptor, index}: EntityOptions) {
    this.propertyKey = propertyKey;
    this.propertyName = String(propertyKey);
    this.descriptor = descriptor;
    this.index = index;
    this.decoratorType = getDecoratorType([target, propertyKey, descriptor || index], true);
    this._target = target;
  }

  /**
   * Reference to the class
   */
  get target() {
    return this._target;
  }

  /**
   * Return the class name of the entity.
   * @returns {string}
   * @todo should not be use in final API
   */
  get targetName(): string {
    return nameOfClass(this.target);
  }

  /**
   * Return the collection name
   * @returns {string}
   * @todo should not be use in final API
   */
  get collectionName(): string {
    return this.collectionType ? nameOf(this.collectionType) : "";
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
  }

  /**
   * Return target type name
   * @returns {string}
   * @todo should not be use in final API
   */
  get typeName(): string {
    return nameOf(this._type);
  }

  /**
   * Return the itemSchema target type. if the type is a function used for recursive model, the function will be called to
   * get the right type.
   */
  get computedType() {
    return this._type;
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
}
