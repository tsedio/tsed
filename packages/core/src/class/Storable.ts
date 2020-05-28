import {Type} from "../interfaces";
import {classOf, isCollection, isNumber, isObject, nameOf} from "../utils/ObjectUtils";
import {Entity} from "./Entity";
import {Metadata} from "./Metadata";
import {Store} from "./Store";

export abstract class Storable extends Entity {
  /**
   * Required entity.
   */
  public required: boolean = false;
  /**
   * Allowed value when the entity is required.
   * @type {Array}
   */
  public allowedRequiredValues: any[] = [];
  /**
   * Custom name.
   */
  public name: string;
  protected _store: Store;

  constructor(target: Type<any>, propertyKey: string | symbol, index?: number | PropertyDescriptor) {
    super({
      target,
      propertyKey,
      index: (isNumber(index) ? index : undefined) as any,
      descriptor: isObject(index) ? index : undefined
    });

    this._target = target;
    this.build(target);

    if (target) {
      this._store = Store.from(target, propertyKey, index);
    }
  }

  /**
   * Class of the entity.
   * @returns {Type<any>}
   */
  get target(): Type<any> {
    return this._target ? classOf(this._target) : this._target;
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
   * @returns {Store}
   */
  public get store(): Store {
    return this._store;
  }

  /**
   * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
   * @param value
   * @returns {boolean}
   */
  isRequired(value: any): boolean {
    return this.required && [undefined, null, ""].includes(value) && !this.allowedRequiredValues.includes(value);
  }

  protected build(target: Type<any>) {
    if (target && this._target) {
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
  }
}
