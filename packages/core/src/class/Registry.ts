import {Type} from "../interfaces";
import {getClass, getClassOrSymbol} from "../utils";

export interface RegistryHook<T> {
  /**
   *
   * @param {RegistryKey} key
   * @param {T} item
   */
  onCreate?(key: RegistryKey, item: T): void;

  /**
   *
   * @param {RegistryKey} key
   */
  // onDelete?(key: RegistryKey): void;
}

export type RegistryKey = string | symbol | Type<any> | Function | any;

/**
 * @private
 */
export class Registry<T, O> extends Map<RegistryKey, T> {
  /**
   *
   * @param {Type<T>} _class
   * @param {RegistryHook<T>} options
   */
  constructor(private _class: Type<T>, private options: RegistryHook<T> = {}) {
    super();
    this._class = getClass(this._class);
  }

  /**
   * The get() method returns a specified element from a Map object.
   * @param key Required. The key of the element to return from the Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   */
  get(key: RegistryKey): T | undefined {
    return super.get(getClassOrSymbol(key));
  }

  /**
   *
   * @param key
   */
  createIfNotExists(key: RegistryKey): T {
    if (!this.has(key)) {
      const item = new this._class(key);
      this.set(key, item);
      if (this.options && this.options.onCreate) {
        this.options.onCreate(key, item);
      }
    }

    return this.get(key)!;
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param key
   * @returns {boolean}
   */
  has(key: RegistryKey): boolean {
    return super.has(getClassOrSymbol(key));
  }

  /**
   * The set() method adds or updates an element with a specified key and value to a Map object.
   * @param key Required. The key of the element to add to the Map object.
   * @param metadata Required. The value of the element to add to the Map object.
   * @returns {Registry}
   */
  set(key: RegistryKey, metadata: T): this {
    super.set(getClassOrSymbol(key), metadata);

    return this;
  }

  /**
   *
   * @param target
   * @param options
   */
  merge(target: RegistryKey, options: Partial<O>): void {
    const meta: {[key: string]: any} = this.createIfNotExists(target);

    Object.keys(options).forEach(key => {
      meta[key] = (options as any)[key];
    });

    this.set(target, meta as T);
  }

  /**
   * The delete() method removes the specified element from a Map object.
   * @param key Required. The key of the element to remove from the Map object.
   * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
   */
  delete(key: RegistryKey): boolean {
    return super.delete(getClassOrSymbol(key));
  }
}
