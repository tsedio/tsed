"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module common/core
 */
const utils_1 = require("../utils");
/** */
function Configurable(value = true) {
    return (target, propertyKey) => {
        const descriptor = utils_1.descriptorOf(target, propertyKey) || { writable: true, enumerable: true };
        descriptor.configurable = value;
        Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);
        return descriptor;
    };
}
exports.Configurable = Configurable;
//# sourceMappingURL=configurable.js.map