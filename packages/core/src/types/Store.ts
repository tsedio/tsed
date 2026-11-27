import {DecoratorTypes} from "./DecoratorTypes.js";
import {Metadata} from "./Metadata.js";
import type {Type} from "./Type.js";
import {decoratorTypeOf} from "../utils/decoratorTypeOf.js";
import {deepClone} from "../utils/deepClone.js";
import {deepMerge} from "../utils/deepMerge.js";
import {descriptorOf} from "../utils/descriptorOf.js";
import {isSymbol} from "../utils/isSymbol.js";
import {nameOf} from "../utils/nameOf.js";

/**
 * Metadata key used to reference the class-level store.
 * @ignore
 */
export const CLASS_STORE = "tsed:class:store";
/**
 * Metadata key used to reference the method-level store.
 * @ignore
 */
export const METHOD_STORE = "tsed:method:store";

/**
 * Metadata key used to reference the property-level store.
 * @ignore
 */
export const PROPERTY_STORE = "tsed:property:store";
/**
 * Metadata key used to reference the parameter-level store.
 * @ignore
 */
export const PARAM_STORE = "tsed:param:store";

const stores = new Map<symbol, Store>();

// named parameters instead of rest args, and one lookup when the store exists (the frequent case).
// The class store is read without a property key argument, as before: the Metadata calls keep their arity
function storeGet(key: string, target: any, propertyKey?: string | symbol): Store {
  if (isSymbol(target)) {
    let store = stores.get(target);

    if (!store) {
      store = new Store();
      stores.set(target, store);
    }

    return store;
  }

  const isClass = key === CLASS_STORE;
  const existing = isClass ? Metadata.getOwn(key, target) : Metadata.getOwn(key, target, propertyKey);

  if (existing !== undefined || (isClass ? Metadata.hasOwn(key, target) : Metadata.hasOwn(key, target, propertyKey))) {
    return existing;
  }

  const store = new Store();

  if (isClass) {
    Metadata.set(key, store, target);
  } else {
    Metadata.set(key, store, target, propertyKey);
  }

  return store;
}

function defineStore(args: any[]): Store {
  const [target, propertyKey, descriptor] = args;

  switch (decoratorTypeOf(args)) {
    case DecoratorTypes.PARAM_CTOR:
    case DecoratorTypes.PARAM_STC:
    case DecoratorTypes.PARAM:
      const store = storeGet(PARAM_STORE, target, propertyKey);
      const index = "" + descriptor;

      if (!store.has(index)) {
        store.set(index, new Store());
      }

      return store.get(index);
    case DecoratorTypes.PROP:
    case DecoratorTypes.PROP_STC:
      return storeGet(PROPERTY_STORE, target, propertyKey);
    case DecoratorTypes.METHOD:
    case DecoratorTypes.METHOD_STC:
      return storeGet(METHOD_STORE, target, propertyKey);
    case DecoratorTypes.CLASS:
      return storeGet(CLASS_STORE, target);
  }
}

/**
 * Lightweight key/value registry used to attach and retrieve metadata at
 * class, method, property, and parameter levels.
 *
 * The `Store` is used internally by decorators and utilities to group
 * metadata by symbol. Only the exported class is documented per the
 * symbols-only rule; members are intentionally not described here.
 *
 * @public
 */
export class Store {
  private _entries = new Map<string, any>();

  /**
   * Create or get a Store from given args (target, property, descriptor).
   * @param args
   * @returns {Store}
   */
  static from(...args: any[]): Store {
    return defineStore(args);
  }

  /**
   * Create store on the method.
   * @param target
   * @param {string} propertyKey
   * @returns {Store}
   */
  static fromMethod(target: Object, propertyKey: string | symbol): Store {
    return Store.from(target, propertyKey, descriptorOf(target, propertyKey));
  }

  static mergeStoreFrom(target: Type<any>, source: Type<any>, ...args: any[]) {
    const store = Store.from(target, ...args);

    Store.from(source, ...args)._entries.forEach((value, key) => {
      store.merge(key, value);
    });

    return store;
  }

  static mergeStoreMethodFrom(target: Type<any>, source: Type<any>, propertyKey: string | symbol) {
    return this.mergeStoreFrom(target, source, propertyKey, descriptorOf(target, propertyKey));
  }

  /**
   * The get() method returns a specified element from a Map object.
   * @param key Required. The key of the element to return from the Map object.
   * @param defaultValue
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   */
  get<T = any>(key: any, defaultValue?: any): T {
    return this._entries.get(nameOf(key)) || defaultValue;
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param key
   * @returns {boolean}
   */
  has(key: any): boolean {
    return this._entries.has(nameOf(key));
  }

  /**
   * The set() method adds or updates an element with a specified key and value to a Map object.
   * @param key Required. The key of the element to add to the Map object.
   * @param metadata Required. The value of the element to add to the Map object.
   */
  set(key: any, metadata: any): Store {
    this._entries.set(nameOf(key), metadata);

    return this;
  }

  /**
   * The delete() method removes the specified element from a Map object.
   * @param key Required. The key of the element to remove from the Map object.
   * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
   */
  delete(key: string): boolean {
    return this._entries.delete(nameOf(key));
  }

  /**
   * Merge given value with existing value.
   * @param key
   * @param value
   * @param inverse Change the merge order. Get the existing value and apply over given value
   * @returns {Store}
   */
  merge(key: any, value: any, inverse: boolean = false): Store {
    let _value_ = this.get(key);

    if (_value_) {
      value = deepClone(value);
      _value_ = deepClone(_value_);
      value = inverse ? deepMerge(value, _value_) : deepMerge(_value_, value);
    }

    this.set(key, value);

    return this;
  }

  toJson() {
    // Object.fromEntries() defines own properties, as the spread did (a "__proto__" key stays an own key),
    // without copying the accumulated object for each entry
    return Object.fromEntries(this._entries);
  }
}
