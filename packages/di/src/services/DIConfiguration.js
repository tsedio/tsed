"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
class DIConfiguration {
    constructor(initialProps = {}) {
        this.default = new Map();
        this.map = new Map();
        Object.entries(Object.assign({ scopes: {} }, initialProps)).forEach(([key, value]) => {
            this.default.set(key, value);
        });
        return new Proxy(this, {
            getOwnPropertyDescriptor(target, p) {
                return Reflect.getOwnPropertyDescriptor(target, p);
            },
            has(target, p) {
                if (Reflect.has(target, p) || typeof p === "symbol") {
                    return Reflect.has(target, p);
                }
                return target.get(p) !== undefined;
            },
            get(target, p, receiver) {
                if (Reflect.has(target, p) || typeof p === "symbol") {
                    return Reflect.get(target, p, receiver);
                }
                return target.get(p);
            },
            set(target, p, value, receiver) {
                if (Reflect.has(target, p) || typeof p === "symbol") {
                    return Reflect.set(target, p, value, receiver);
                }
                return !!target.set(p, value);
            },
            deleteProperty(target, p) {
                return Reflect.deleteProperty(target, p);
            },
            defineProperty(target, p, attributes) {
                return Reflect.defineProperty(target, p, attributes);
            },
            ownKeys(target) {
                return Reflect.ownKeys(target)
                    .concat(Array.from(target.default.keys()))
                    .concat(Array.from(target.map.keys()));
            }
        });
    }
    get scopes() {
        return this.getRaw("scopes");
    }
    set scopes(value) {
        this.setRaw("scopes", value);
    }
    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    forEach(callbackfn, thisArg) {
        return new Set([...Array.from(this.default.keys()), ...Array.from(this.map.keys())]).forEach(key => {
            callbackfn(this.getRaw(key), key, this.map);
        }, thisArg);
    }
    /**
     *
     * @param propertyKey
     * @param value
     */
    set(propertyKey, value) {
        if (typeof propertyKey === "string") {
            this.setRaw(propertyKey, value);
        }
        else {
            Object.assign(this, propertyKey);
        }
        return this;
    }
    setRaw(propertyKey, value) {
        core_1.setValue(propertyKey, value, this.map);
        return this;
    }
    /**
     *
     * @param propertyKey
     * @returns {undefined|any}
     */
    get(propertyKey) {
        return this.resolve(this.getRaw(propertyKey));
    }
    getRaw(propertyKey) {
        const value = core_1.getValue(propertyKey, this.map);
        if (value !== undefined) {
            return value;
        }
        return core_1.getValue(propertyKey, this.default);
    }
    merge(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            const descriptor = Object.getOwnPropertyDescriptor(DIConfiguration.prototype, key);
            const originalValue = this.get(key);
            value = core_1.deepExtends(value, originalValue);
            if (descriptor && !["default", "set", "map", "get"].includes(key)) {
                this[key] = value;
            }
        });
    }
    /**
     *
     * @param value
     * @returns {any}
     */
    resolve(value) {
        if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([k, v]) => {
                value[k] = this.resolve(v);
            });
            return value;
        }
        if (typeof value === "string") {
            return value
                .replace(/\${([\w.]+)}/gi, (match, key) => core_1.getValue(key, this.map))
                .replace(/<([\w.]+)>/gi, (match, key) => core_1.getValue(key, this.map))
                .replace(/{{([\w.]+)}}/gi, (match, key) => core_1.getValue(key, this.map));
        }
        return value;
    }
    build() {
        this.forEach((value, key) => {
            this.map.set(key, value);
        });
        this.set = this.setRaw;
        this.get = this.getRaw = (propertyKey) => core_1.getValue(propertyKey, this.map);
    }
}
exports.DIConfiguration = DIConfiguration;
//# sourceMappingURL=DIConfiguration.js.map