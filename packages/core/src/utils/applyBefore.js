"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param target
 * @param {string} name
 * @param {Function} callback
 */
function applyBefore(target, name, callback) {
    const original = target[name];
    target[name] = function (...args) {
        callback(...args);
        return original.apply(this, args);
    };
}
exports.applyBefore = applyBefore;
//# sourceMappingURL=applyBefore.js.map