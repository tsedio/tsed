import {Type} from "../interfaces";
import {classOf, isCollection, isNumber, isObject, nameOf} from "../utils/ObjectUtils";
import {Entity} from "./Entity";
import {Metadata} from "./Metadata";
import {Store} from "./Store";

/**
 * @deprecated Will be removed in v6
 */
export abstract class Storable extends Entity {
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
