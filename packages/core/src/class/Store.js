"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Metadata_1 = require("./Metadata");
exports.CLASS_STORE = "tsed:class:store";
exports.METHOD_STORE = "tsed:method:store";
exports.PROPERTY_STORE = "tsed:property:store";
exports.PARAM_STORE = "tsed:param:store";
const stores = new Map();
/**
 *
 */
class Store {
    constructor(args) {
        const [target, propertyKey, descriptor] = args;
        this._map = (() => {
            switch (utils_1.getDecoratorType(args)) {
                case "parameter":
                    const store = this._storeGet(exports.PARAM_STORE, target, propertyKey);
                    if (!store.has("" + descriptor)) {
                        store.set("" + descriptor, new Map());
                    }
                    return store.get("" + descriptor);
                case "property":
                    return this._storeGet(exports.PROPERTY_STORE, target, propertyKey);
                case "method":
                    return this._storeGet(exports.METHOD_STORE, target, propertyKey);
                case "class":
                    return this._storeGet(exports.CLASS_STORE, target);
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
    static from(...args) {
        return new Store(args);
    }
    /**
     * Create store on the method.
     * @param target
     * @param {string} propertyKey
     * @returns {Store}
     */
    static fromMethod(target, propertyKey) {
        return new Store([target, propertyKey, utils_1.descriptorOf(target, propertyKey)]);
    }
    /**
     * Create a store correctly configured from the parameters given by the decorator.
     * The `fn` can return a decorator that will be initialized with the parameters (target, propertyKey, descriptor).
     * @param {(store: Store, parameters: DecoratorParameters) => void} fn
     * @deprecated Use StoreFn
     * @returns {Function}
     */
    /* istanbul ignore next */
    static decorate(fn) {
        return (...parameters) => {
            const store = Store.from(...parameters);
            const result = fn(store, parameters);
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
    get(key) {
        return this._map.get(utils_1.nameOf(key));
    }
    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return this._map.has(utils_1.nameOf(key));
    }
    /**
     * The set() method adds or updates an element with a specified key and value to a Map object.
     * @param key Required. The key of the element to add to the Map object.
     * @param metadata Required. The value of the element to add to the Map object.
     * @returns {Registry}
     */
    set(key, metadata) {
        this._map.set(utils_1.nameOf(key), metadata);
        return this;
    }
    /**
     * The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    entries() {
        return this._map.entries();
    }
    /**
     * The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    keys() {
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
    delete(key) {
        return this._map.delete(utils_1.nameOf(key));
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
        return this._map.forEach(callbackfn);
    }
    /**
     * The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.
     * @returns {IterableIterator} A new Map iterator object.
     */
    values() {
        return this._map.values();
    }
    /**
     * Merge given value with existing value.
     * @param key
     * @param value
     * @param inverse Change the merge order. Get the existing value and apply over given value
     * @returns {Store}
     */
    merge(key, value, inverse = false) {
        let _value_ = this.get(key);
        if (_value_) {
            value = utils_1.deepClone(value);
            _value_ = utils_1.deepClone(_value_);
            value = inverse ? utils_1.deepExtends(value, _value_) : utils_1.deepExtends(_value_, value);
        }
        this.set(key, value);
        return this;
    }
    /**
     * Store all keys contains in the options object.
     * @param options
     * @param args
     */
    storeValues(options) {
        Object.keys(options).forEach(key => this.set(key, options[key]));
    }
    /**
     *
     * @param key
     * @param args
     * @private
     */
    _storeGet(key, ...args) {
        if (utils_1.isSymbol(args[0])) {
            if (!stores.has(args[0])) {
                stores.set(args[0], new Map());
            }
            return stores.get(args[0]);
        }
        else {
            const registry = Metadata_1.Metadata;
            if (!registry.hasOwn(key, ...args)) {
                registry.set(key, new Map(), ...args);
            }
            return registry.getOwn(key, ...args);
        }
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map