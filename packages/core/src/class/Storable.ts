import {NotEnumerable} from "../decorators";
import {Type} from "../interfaces";
import {EntityDescription} from "./EntityDescription";

import {Store} from "./Store";

/**
 *
 */
export abstract class Storable extends EntityDescription {
  @NotEnumerable()
  protected _store: Store;

  constructor(_target: Type<any>, _propertyKey: string | symbol, _index?: number | PropertyDescriptor) {
    super(_target, _propertyKey, _index);
    this._store = Store.from(_target, _propertyKey, _index);
  }

  /**
   *
   * @returns {Store}
   */
  public get store(): Store {
    return this._store;
  }
}
