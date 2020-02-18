"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module common/core
 */
const utils_1 = require("../utils");
/** */
function Enumerable(value = true) {
    return (target, propertyKey) => {
        const descriptor = utils_1.descriptorOf(target, propertyKey) || { writable: true, configurable: true };
        descriptor.enumerable = value;
        Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);
        return descriptor;
    };
}
exports.Enumerable = Enumerable;
//# sourceMappingURL=enumerable.js.map