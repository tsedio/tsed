import {Enumerable, NotEnumerable} from "../decorators";
import {Type} from "../interfaces";
import {getClass, isArrayOrArrayClass, isClass, isCollection, isDate, isObject, isPrimitiveOrPrimitiveClass, nameOf} from "../utils";
import {Metadata} from "./Metadata";

/**
 * EntityDescription store all information collected by a decorator (class, property key and in option the index of the parameters).
 */
export abstract class EntityDescription {
  /**
   * Custom name.
   */
  @Enumerable()
  public name: string;
  /**
   * Index of the entity. Only used when the entity describe a parameters.
   */
  @NotEnumerable()
  public readonly index: number;
  /**
   *
   */
  @Enumerable()
  public readonly propertyKey: string | symbol;
  /**
   * Type of the collection (Array, Map, Set, etc...)
   */
  @Enumerable()
  public collectionType: Type<any>;
  /**
   * Required entity.
   */
  @Enumerable()
  public required: boolean = false;

  /**
   * Allowed value when the entity is required.
   * @type {Array}
   */
  @Enumerable()
  public allowedRequiredValues: any[] = [];

  /**
   * Type of the entity.
   */
  @NotEnumerable()
  protected _type: Type<any>;

  constructor(protected _target: Type<any>, propertyKey: string | symbol, index?: number | PropertyDescriptor) {
    if (typeof index === "number") {
      this.index = index;
    }

    this.propertyKey = propertyKey;
    this.target = _target;
  }

  /**
   * Class of the entity.
   * @returns {Type<any>}
   */
  get target(): Type<any> {
    return getClass(this._target);
  }

  /**
   *
   * @param {Type<any>} target
   */
  set target(target: Type<any>) {
    this._target = target;
    let type;

    if (typeof this.index === "number") {
      type = Metadata.getParamTypes(this._target, this.propertyKey)[this.index];
    } else {
      type = Metadata.getType(this._target, this.propertyKey);
    }

    if (isCollection(type)) {
      this.collectionType = type;
      this._type = Object;
    } else {
      this._type = type;
    }

    this.name = nameOf(this.propertyKey);
  }

  /**
   * Return the class name of the entity.
   * @returns {string}
   */
  get targetName(): string {
    return nameOf(this.target);
  }

  /**
   *
   * @returns {Type<any>}
   */
  get type(): Type<any> {
    return this._type;
  }

  /**
   *
   * @param value
   */
  set type(value: Type<any>) {
    this._type = value || Object;
  }

  /**
   *
   * @returns {string}
   */
  get typeName(): string {
    return nameOf(this._type);
  }

  /**
   *
   * @returns {string}
   */
  get collectionName(): string {
    return this.collectionType ? nameOf(this.collectionType) : "";
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
    return isDate(this._type);
  }

  /**
   *
   * @returns {boolean}
   */
  get isObject() {
    return isObject(this.type);
  }

  /**
   *
   * @returns {boolean}
   */
  get isClass() {
    return isClass(this.type);
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].indexOf(value) > -1 && this.allowedRequiredValues.indexOf(value) === -1;
  }
}
