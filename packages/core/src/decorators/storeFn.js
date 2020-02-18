"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../class/Store");
/**
 * Create a store correctly configured from the parameters given by the decorator.
 * The `fn` can return a decorator that will be initialized with the parameters (target, propertyKey, descriptor).
 * @param {(store: Store, parameters: DecoratorParameters) => void} fn
 * @returns {Function}
 */
function StoreFn(fn) {
    return (...parameters) => {
        const store = Store_1.Store.from(...parameters);
        const result = fn(store, parameters);
        if (typeof result === "function") {
            result(...parameters);
        }
        return parameters[2];
    };
}
exports.StoreFn = StoreFn;
//# sourceMappingURL=storeFn.js.map