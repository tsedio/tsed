"use strict";
/**
 * Remove undefined value
 * @param obj
 */
Object.defineProperty(exports, "__esModule", { value: true });
function cleanObject(obj) {
    return Object.entries(obj).reduce((obj, [key, value]) => value === undefined
        ? obj
        : Object.assign(Object.assign({}, obj), { [key]: value }), {});
}
exports.cleanObject = cleanObject;
//# sourceMappingURL=cleanObject.js.map