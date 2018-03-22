import {DecoratorParameters} from "../interfaces";
/**
 * @module common/core
 */
/** */
import {deepExtends, descriptorOf, getDecoratorType, nameOf} from "../utils";

import {Metadata} from "./Metadata";
import {Registry} from "./Registry";

export const CLASS_STORE = "tsed:class:store";
export const METHOD_STORE = "tsed:method:store";
export const PROPERTY_STORE = "tsed:property:store";
export const PARAM_STORE = "tsed:param:store";

export type StoreMap = Map<string, any>;

/**
 *
 */
export class Store {

    private _map: StoreMap;

    constructor(args: any[]) {

        const [target, propertyKey, descriptor] = args;
        this._map = (() => {
            switch (getDecoratorType(args)) {
                case "parameter":
                    const store = this._storeGet(PARAM_STORE, target, propertyKey);
                    if (!store.has("" + descriptor)) {
                        store.set("" + descriptor, new Map<string, any>());
                    }

                    return store.get("" + descriptor);
                case "property":
                    return this._storeGet(PROPERTY_STORE, target, propertyKey);
                case "method":
                    return this._storeGet(METHOD_STORE, target, propertyKey);
                case "class":
                    return this._storeGet(CLASS_STORE, target);
            }
        })();
    }

    /**
     * Return the size of the collection.
     * @returns {number}
     */
    get size() {
        return this._map.size;
    }

    /**
     * Create or get a Store from args {target + methodName + descriptor}
     * @param args
     * @returns {Store}
     */
    static from(...args: any[]): Store {
        return new Store(args);
    }

    /**
     * Create store on the method.
     * @param target
     * @param {string} propertyKey
     * @returns {Store}
     */
    static fromMethod(target: any, propertyKey: string): Store {
        return new Store([
            target,
            propertyKey,
            descriptorOf(target, propertyKey)
        ]);
    }

    /**
     * Create a store correctly configured from the parameters given by the decorator.
     * The `fn` can return a decorator that will be initialized with the parameters (target, propertyKey, descriptor).
     * @param {(store: Store, parameters: DecoratorParameters) => void} fn
     * @returns {Function}
     */
    static decorate(fn: (store: Store, parameters: DecoratorParameters) => void): Function {
        return (...parameters: any[]): any => {
            const store = Store.from(...parameters);
            const result: any = fn(store, parameters as DecoratorParameters);
            if (typeof result === "function") {
                result(...parameters);
            }
            return parameters[2];
        };
    }

    /**
     * The get() method returns a specified element from a Map object.
     * @param key Required. The key of the element to return from the Map object.
     * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
     */
    get<T>(key: any): any {
        return this._map.get(nameOf(key));
    }

    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @param key
     * @returns {boolean}
     */
    has(key: any): boolean {
        return this._map.has(nameOf(key));
    }

    /**
     * The set() method adds or updates an element with a specified key and value to a Map object.
     * @param key Required. The key of the element to add to the Map object.
     * @param metadata Required. The value of the element to add to the Map object.
     * @returns {Registry}
     */
    set(key: any, metadata: any): Store {
        this._map.set(nameOf(key), metadata);
        return this;
    }

    /**
     * The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    entries(): IterableIterator<[string, any]> {
        return this._map.entries();
    }

    /**
     * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    keys(): IterableIterator<string> {
        return this._map.keys();
    }

    /**
     * The clear() method removes all elements from a Map object.
     */
    clear() {
        return this._map.clear();
    }

    /**
     * The delete() method removes the specified element from a Map object.
     * @param key Required. The key of the element to remove from the Map object.
     * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
     */
    delete(key: string): boolean {
        return this._map.delete(nameOf(key));
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
    forEach(callbackfn: (value: any, key: string, map: Map<string, any>) => void, thisArg?: any): void {
        return this._map.forEach(callbackfn);
    }

    /**
     * The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    values(): IterableIterator<any> {
        return this._map.values();
    }

    /**
     *
     * @param key
     * @param value
     * @returns {Store}
     */
    merge(key: any, value: any): Store {

        const _value_ = this.get(key);

        if (_value_) {
            value = deepExtends(_value_, value);
        }

        this.set(key, value);
        return this;
    }

    /**
     * Store all keys contains in the options object.
     * @param options
     * @param args
     */
    storeValues(options: { [key: string]: any }) {
        Object.keys(options).forEach(key => this.set(key as any, options[key]));
    }

    /**
     *
     * @param key
     * @param args
     * @private
     */
    private _storeGet(key: string, ...args: any[]): StoreMap {
        const registry = Metadata as any;

        if (!registry.hasOwn(key, ...args)) {
            registry.set(key, new Map<string, any>(), ...args);
        }

        return registry.getOwn(key, ...args);
    }
}
