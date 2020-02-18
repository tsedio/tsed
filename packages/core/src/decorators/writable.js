"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module common/core
 */
const utils_1 = require("../utils");
/** */
function Writable(value = true) {
    return (target, propertyKey) => {
        const descriptor = utils_1.descriptorOf(target, propertyKey) || { configurable: true, enumerable: true };
        descriptor.writable = value;
        Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);
        return descriptor;
    };
}
exports.Writable = Writable;
//# sourceMappingURL=writable.js.map