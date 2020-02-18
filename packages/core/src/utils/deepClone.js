"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectUtils_1 = require("./ObjectUtils");
const isBasicType = (source) => ObjectUtils_1.isNil(source) || ObjectUtils_1.isPrimitive(source) || ObjectUtils_1.isSymbol(source) || ObjectUtils_1.isFunction(source);
/**
 * Return a cloned value
 * @param source
 */
function deepClone(source) {
    let dest;
    if (isBasicType(source)) {
        return source;
    }
    if (ObjectUtils_1.isDate(source)) {
        return new Date(source);
    }
    dest = ObjectUtils_1.isArrayOrArrayClass(source) ? [] : {};
    for (const key in source) {
        // Use getOwnPropertyDescriptor instead of source[key] to prevent from trigering setter/getter.
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor) {
            if (!ObjectUtils_1.isFunction(descriptor.value)) {
                dest[key] = deepClone(descriptor.value);
            }
            else {
                Object.defineProperty(dest, key, descriptor);
            }
        }
    }
    if (!ObjectUtils_1.isArrayOrArrayClass(source)) {
        const prototype = Reflect.getPrototypeOf(source);
        Reflect.setPrototypeOf(dest, prototype);
    }
    return dest;
}
exports.deepClone = deepClone;
//# sourceMappingURL=deepClone.js.map