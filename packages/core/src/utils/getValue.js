"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
function getValue(expression, scope, defaultValue, separator = ".") {
    if (!expression) {
        return scope;
    }
    const keys = expression.split(separator);
    const getValue = (key) => {
        if (scope instanceof Map) {
            return scope.get(key);
        }
        return scope[key];
    };
    while ((scope = getValue(keys.shift())) && keys.length) { }
    return scope === undefined ? defaultValue : scope;
}
exports.getValue = getValue;
//# sourceMappingURL=getValue.js.map