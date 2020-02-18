"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectUtils_1 = require("./ObjectUtils");
/**
 *
 * @param out
 * @param obj
 * @param {{[p: string]: (collection: any[], value: any) => any}} reducers
 * @returns {any}
 */
function deepExtends(out, obj, reducers = {}) {
    if (obj === undefined || obj === null) {
        return out;
    }
    if (ObjectUtils_1.isPrimitive(obj) || typeof obj === "symbol" || typeof obj === "function") {
        return obj;
    }
    if (ObjectUtils_1.isArrayOrArrayClass(obj)) {
        out = out || [];
    }
    else {
        out = out || (obj ? (ObjectUtils_1.classOf(obj) !== Object ? Object.create(obj) : {}) : {});
    }
    const defaultReducer = reducers["default"]
        ? reducers["default"]
        : (collection, value) => {
            collection.indexOf(value) === -1 && collection.push(value);
            return collection;
        };
    const set = (key, value) => {
        if (ObjectUtils_1.isArrayOrArrayClass(obj)) {
            out.indexOf(value) === -1 && out.push(value);
        }
        else {
            out[key] = value;
        }
    };
    Object.keys(obj).forEach(key => {
        let value = obj[key];
        if (value === undefined || value === null) {
            return;
        }
        if (value === "" && out[key] !== "") {
            return;
        }
        if (ObjectUtils_1.isPrimitiveOrPrimitiveClass(value) || typeof value === "function") {
            set(key, value);
            return;
        }
        if (ObjectUtils_1.isArrayOrArrayClass(value)) {
            value = value.map((value) => deepExtends(undefined, value));
            set(key, []
                .concat(out[key] || [], value)
                .reduce((collection, value) => (reducers[key] ? reducers[key](collection, value) : defaultReducer(collection, value)), []));
            return;
        }
        // Object
        if (ObjectUtils_1.isArrayOrArrayClass(obj)) {
            set(key, deepExtends(undefined, value, reducers));
        }
        else {
            set(key, deepExtends(out[key], value, reducers));
        }
    });
    if (ObjectUtils_1.isArrayOrArrayClass(out)) {
        out.reduce((collection, value) => defaultReducer(collection, value), []);
    }
    return out;
}
exports.deepExtends = deepExtends;
//# sourceMappingURL=deepExtends.js.map