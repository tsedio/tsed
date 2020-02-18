"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/**
 * @private
 */
class Registry extends Map {
    /**
     *
     * @param {Type<T>} _class
     * @param {RegistryHook<T>} options
     */
    constructor(_class, options = {}) {
        super();
        this._class = _class;
        this.options = options;
        this._class = utils_1.getClass(this._class);
    }
    /**
     * The get() method returns a specified element from a Map object.
     * @param key Required. The key of the element to return from the Map object.
     * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
     */
    get(key) {
        return super.get(utils_1.getClassOrSymbol(key));
    }
    /**
     *
     * @param key
     */
    createIfNotExists(key) {
        if (!this.has(key)) {
            const item = new this._class(key);
            this.set(key, item);
            if (this.options && this.options.onCreate) {
                this.options.onCreate(key, item);
            }
        }
        return this.get(key);
    }
    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return super.has(utils_1.getClassOrSymbol(key));
    }
    /**
     * The set() method adds or updates an element with a specified key and value to a Map object.
     * @param key Required. The key of the element to add to the Map object.
     * @param metadata Required. The value of the element to add to the Map object.
     * @returns {Registry}
     */
    set(key, metadata) {
        super.set(utils_1.getClassOrSymbol(key), metadata);
        return this;
    }
    /**
     *
     * @param target
     * @param options
     */
    merge(target, options) {
        const meta = this.createIfNotExists(target);
        Object.keys(options).forEach(key => {
            meta[key] = options[key];
        });
        this.set(target, meta);
    }
    /**
     * The delete() method removes the specified element from a Map object.
     * @param key Required. The key of the element to remove from the Map object.
     * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
     */
    delete(key) {
        return super.delete(utils_1.getClassOrSymbol(key));
    }
}
exports.Registry = Registry;
//# sourceMappingURL=Registry.js.map