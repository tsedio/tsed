"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @private
 */
class ProxyMap {
    constructor(registry, mapSettings = {}) {
        this.registry = registry;
        this.mapSettings = mapSettings;
        this[Symbol.toStringTag] = "Map";
        if (this.mapSettings.filter) {
            this.mapSettings.readonly = true;
            this.registry = this.copy();
        }
    }
    /**
     *
     * @returns {IterableIterator<[T , I]>}
     */
    [Symbol.iterator]() {
        return this.registry[Symbol.iterator]();
    }
    /**
     * The clear() method removes all elements from a Map object.
     */
    clear() {
        if (!this.mapSettings.readonly) {
            this.registry.clear();
        }
    }
    /**
     * The delete() method removes the specified element from a Map object.
     * @param key Required. The key of the element to remove from the Map object.
     * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
     */
    delete(key) {
        if (!this.mapSettings.readonly) {
            return this.registry.delete(key);
        }
        return false;
    }
    /**
     * The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    entries() {
        return this.registry.entries();
    }
    /**
     * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    keys() {
        if (this.mapSettings.filter) {
            return this.copy().keys();
        }
        return this.registry.keys();
    }
    /**
     * The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    values() {
        return this.registry.values();
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
    forEach(callbackfn, thisArg) {
        this.registry.forEach(callbackfn, thisArg);
    }
    /**
     * The get() method returns a specified element from a Map object.
     * @param key Required. The key of the element to return from the Map object.
     * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
     */
    get(key) {
        return this.registry.get(key);
    }
    /**
     * The set() method adds or updates an element with a specified key and value to a Map object.
     * @param key Required. The key of the element to add to the Map object.
     * @param value Required. The value of the element to add to the Map object.
     * @returns {Registry}
     */
    set(key, value) {
        if (!this.mapSettings.readonly) {
            this.registry.set(key, value);
        }
        return this;
    }
    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return this.registry.has(key);
    }
    /**
     *
     * @returns {Map<any, any>}
     */
    copy() {
        const map = new Map();
        this.forEach((value, key) => {
            if (ProxyMap.query(value, this.mapSettings.filter)) {
                map.set(key, value);
            }
        });
        return map;
    }
    /**
     * Return the size of the map.
     * @returns {number}
     */
    get size() {
        return this.registry.size;
    }
    /**
     *
     * @param value
     * @param query
     * @returns {boolean}
     */
    static query(value, query) {
        /* istanbul ignore next */
        if (!query) {
            return true;
        }
        if (value === query) {
            return true;
        }
        /* istanbul ignore else */
        if (typeof value === "object") {
            return !!Object.keys(query).find(key => {
                /* istanbul ignore else */
                if (value[key] && query[key]) {
                    return this.query(value[key], query[key]);
                }
                /* istanbul ignore next */
                return false;
            });
        }
        /* istanbul ignore next */
        return false;
    }
}
exports.ProxyMap = ProxyMap;
//# sourceMappingURL=ProxyMap.js.map