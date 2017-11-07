/**
 * @module common/core
 */

import {Type} from "../interfaces";

import {getClass, getClassOrSymbol} from "../utils";

/**
 *
 * @private
 */
export class Registry<T, O> {
    /**
     * Internal Map
     * @type {Array}
     */
    private _map: Map<Type<any> | symbol, T> = new Map<Type<any> | symbol, T>();

    constructor(private _class: Type<T>) {
        this._class = getClass(this._class);
    }

    /**
     *
     * @returns {number}
     */
    get size() {
        return this._map.size;
    }

    /**
     * The get() method returns a specified element from a Map object.
     * @param key Required. The key of the element to return from the Map object.
     * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
     */
    get(key: Type<any> | symbol): T | undefined {
        return this._map.get(getClassOrSymbol(key));
    }

    /**
     *
     * @param key
     */
    createIfNotExists(key: Type<any> | symbol): T {
        if (!this.has(key)) {
            this.set(key, new this._class(key));
        }
        return this.get(key)!;
    }

    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @param key
     * @returns {boolean}
     */
    has(key: Type<any> | symbol): boolean {
        return this._map.has(getClassOrSymbol(key));
    }

    /**
     * The set() method adds or updates an element with a specified key and value to a Map object.
     * @param key Required. The key of the element to add to the Map object.
     * @param metadata Required. The value of the element to add to the Map object.
     * @returns {Registry}
     */
    set(key: Type<any> | symbol, metadata: T): this {
        this._map.set(getClassOrSymbol(key), metadata);
        return this;
    }

    /**
     * The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    entries(): IterableIterator<[Type<any> | symbol, T]> {
        return this._map.entries();
    }

    /**
     * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    keys(): IterableIterator<Type<any> | symbol> {
        return this._map.keys();
    }

    /**
     *
     * @param target
     * @param options
     */
    merge(target: Type<any> | symbol, options: Partial<O>): void {

        const meta: T & { [key: string]: any } = this.createIfNotExists(target);

        Object.keys(options).forEach(key => {
            meta[key] = (options as any)[key];
        });

        this.set(target, meta);
    }

    /**
     * The clear() method removes all elements from a Map object.
     */
    clear(): void {
        this._map.clear();
    }

    /**
     * The delete() method removes the specified element from a Map object.
     * @param key Required. The key of the element to remove from the Map object.
     * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
     */
    delete(key: Type<any> | symbol): boolean {
        return this._map.delete(getClassOrSymbol(key));
    }

    /**
     * The forEach() method executes a provided function once per each key/value pair in the Map object, in insertion order.
     *
     * @param callbackfn Function to execute for each element.
     * @param thisArg Value to use as this when executing callback.
     * @description
     * The forEach method executes the provided callback once for each key of the map which actually exist. It is not invoked for keys which have been deleted. However, it is executed for values which are present but have the value undefined.
     * callback is invoked with three arguments:
     *
     * * the element value
     * * the element key
     * * the Map object being traversed
     *
     * If a thisArg parameter is provided to forEach, it will be passed to callback when invoked, for use as its this value.  Otherwise, the value undefined will be passed for use as its this value.  The this value ultimately observable by callback is determined according to the usual rules for determining the this seen by a function.
     *
     * Each value is visited once, except in the case when it was deleted and re-added before forEach has finished. callback is not invoked for values deleted before being visited. New values added before forEach has finished will be visited.
     * forEach executes the callback function once for each element in the Map object; it does not return a value.
     *
     */
    forEach(callbackfn: (value: T, key: Type<any>, map: Map<Type<any> | symbol, T>) => void, thisArg?: any): void {
        this._map.forEach(callbackfn);
    }

    /**
     * The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    values(): IterableIterator<T> {
        return this._map.values();
    }
}
