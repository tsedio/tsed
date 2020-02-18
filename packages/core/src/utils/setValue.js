"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setValue(expression, value, scope, separator = ".") {
    const keys = expression.split(separator);
    const setValue = (key, add) => {
        if (add) {
            if (typeof scope.set === "function") {
                scope.set(key, value);
            }
            else {
                scope[key] = value;
            }
            return false;
        }
        if (typeof scope.set === "function") {
            if (!scope.has(key)) {
                scope.set(key, {});
            }
            scope = scope.get(key);
        }
        else {
            scope = scope[key] || {};
        }
        return true;
    };
    while (setValue(keys.shift(), !keys.length)) { }
}
exports.setValue = setValue;
//# sourceMappingURL=setValue.js.map