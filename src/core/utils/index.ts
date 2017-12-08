/**
 * @module common/core
 */
/** */

import {DecoratorParameters} from "../interfaces";

/**
 * Get the provide constructor.
 * @param targetClass
 */
export const getContructor = (targetClass: any): Function =>
    typeof targetClass === "function"
        ? targetClass
        : targetClass.constructor;

/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 */
export function getClass(target: any): any {
    return target.prototype ? target : target.constructor;
}

/**
 *
 * @param target
 * @returns {symbol}
 */
export function getClassOrSymbol(target: any): any {
    return typeof target === "symbol" ? target : getClass(target);
}

/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
    return isString(target)
        || isNumber(target)
        || isBoolean(target);
}

/**
 *
 * @param target
 * @returns {"string" | "number" | "boolean" | "any"}
 */
export function primitiveOf(target: any): "string" | "number" | "boolean" | "any" {
    if (isString(target)) {
        return "string";
    }
    if (isNumber(target)) {
        return "number";
    }
    if (isBoolean(target)) {
        return "boolean";
    }
    return "any";
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isString(target: any): boolean {
    return typeof target === "string" || target instanceof String || target === String;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isNumber(target: any): boolean {
    return typeof target === "number" || target instanceof Number || target === Number;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isBoolean(target: any): boolean {
    return typeof target === "boolean" || target instanceof Boolean || target === Boolean;
}

/**
 *
 * @param target
 * @returns {Boolean}
 */
export function isArray(target: any): boolean {
    return Array.isArray(target);
}

/**
 * Return true if the clazz is an array.
 * @param target
 * @returns {boolean}
 */
export function isArrayOrArrayClass(target: any): boolean {
    if (target === Array) {
        return true;
    }
    return isArray(target);
}

/**
 * Return true if the target.
 * @param target
 * @returns {boolean}
 */
export function isCollection(target: any): boolean {
    return isArrayOrArrayClass(target)
        || target === Map
        || target instanceof Map
        || target === Set
        || target instanceof Set
        || target === WeakMap
        || target instanceof WeakMap
        || target === WeakSet
        || target instanceof WeakSet;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isDate(target: any): boolean {
    return target === Date || target instanceof Date;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isObject(target: any): boolean {
    return target === Object;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isClass(target: any) {
    return !isPrimitiveOrPrimitiveClass(target)
        && !isObject(target)
        && !isDate(target)
        && target !== undefined
        && !isPromise(target);
}

/**
 * Return true if the value is an empty string, null or undefined.
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
}

/**
 * Get object name
 */
export const nameOf = (obj: any): string => {
    switch (typeof obj) {
        default:
            return "" + obj;
        case "symbol":
            return nameOfSymbol(obj);
        case "function":
            return nameOfClass(obj);
    }
};

/**
 * Get the provide name.
 * @param targetClass
 */
export const nameOfClass = (targetClass: any) => {
    return typeof targetClass === "function"
        ? targetClass.name
        : targetClass.constructor.name;
};
/**
 * Get symbol name.
 * @param sym
 */
export const nameOfSymbol = (sym: symbol): string =>
    sym.toString().replace("Symbol(", "").replace(")", "");

/**
 *
 * @param out
 * @param obj
 * @param {{[p: string]: (collection: any[], value: any) => any}} reducers
 * @returns {any}
 */
export function deepExtends(out: any, obj: any, reducers: { [key: string]: (collection: any[], value: any) => any } = {}): any {

    if (obj === undefined || obj === null) {
        return obj;
    }

    if (isPrimitiveOrPrimitiveClass(obj) || typeof obj === "symbol" || typeof obj === "function") {
        return obj;
    }

    if (isArrayOrArrayClass(obj)) {
        out = out || [];
    } else {
        out = out || {};
    }

    const defaultReducer = reducers["default"] ? reducers["default"] : (collection: any[], value: any) => {
        collection.push(value);
        return collection;
    };
    const set = (key: string | number, value: any) => {
        if (isArrayOrArrayClass(obj)) {
            out.push(value);
        } else {
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

        if (isPrimitiveOrPrimitiveClass(value) || typeof value === "function") {
            set(key, value);
            return;
        }

        if (isArrayOrArrayClass(value)) {

            value = value.map((value: any) => deepExtends(undefined, value));

            set(key, []
                .concat(out[key] || [], value)
                .reduce((collection: any[], value: any) =>
                        reducers[key] ? reducers[key](collection, value) : defaultReducer(collection, value),
                    []));
            return;
        }

        // Object
        if (isArrayOrArrayClass(obj)) {
            set(key, deepExtends(undefined, value, reducers));
        } else {
            set(key, deepExtends(out[key], value, reducers));
        }
    });

    if (isArrayOrArrayClass(out)) {
        out.reduce((collection: any[], value: any) => defaultReducer(collection, value), []);
    }

    return out;
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isPromise(target: any): boolean {
    return target === Promise || target instanceof Promise;
}

/**
 *
 * @param target
 * @returns {any}
 */
export function getInheritedClass(target: any): any {
    return Object.getPrototypeOf(target);
}

/**
 *
 * @param {any[]} args
 * @returns {"parameter" | "property" | "method" | "class"}
 */
export function getDecoratorType(args: any[]): "parameter" | "property" | "method" | "class" {
    const [, propertyKey, descriptor] = args;

    if (typeof descriptor === "number") {
        return "parameter";
    }

    if (propertyKey && descriptor === undefined || descriptor && (descriptor.get || descriptor.set)) {
        return "property";
    }
    return (descriptor && descriptor.value) ? "method" : "class";
}

/**
 *
 * @param target
 * @param {string} propertyKey
 * @returns {PropertyDescriptor}
 */
export function descriptorOf(target: any, propertyKey: string): PropertyDescriptor {
    return Object.getOwnPropertyDescriptor(target && target.prototype || target, propertyKey)!;
}

/**
 *
 * @param target
 * @param {string} propertyKey
 * @returns {DecoratorParameters}
 */
export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
    return [
        target,
        propertyKey,
        descriptorOf(target, propertyKey)!
    ];
}

/**
 *
 * @param target
 * @returns {Array}
 */
export function ancestorsOf(target: any) {
    const classes = [];

    let currentTarget = getClass(target);

    while (nameOf(currentTarget) !== "") {
        classes.unshift(currentTarget);
        currentTarget = getInheritedClass(currentTarget);
    }

    return classes;
}

/**
 *
 * @param target
 * @param {string} name
 * @param {Function} callback
 */
export function applyBefore(target: any, name: string, callback: Function) {
    const original = target[name];
    target[name] = function (...args: any[]) {
        callback(...args);
        return original.apply(this, args);
    };
}

/**
 *
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
export function getValue(expression: string, scope: any, defaultValue?: any, separator = ".") {
    const keys: string[] = expression.split(separator);

    const getValue = (key: string) => {
        if (isCollection(scope)) {
            return scope.get(key);
        }
        return scope[key];
    };

    while ((scope = getValue(keys.shift()!)) && keys.length) {
    }

    return scope === undefined ? defaultValue : scope;
}

/**
 *
 * @param {Promise<any>} promise
 * @param {number} time
 * @returns {Promise<any>}
 */
export function promiseTimeout(promise: Promise<any>, time: number = 1000): Promise<{ ok: boolean, response: any }> {
    const timeout = (promise: Promise<any>, time: number) => new Promise((resolve) => {
        promise.then((response) => {
            resolve();
            return response;
        });
        setTimeout(() => resolve({ok: false}), time);
    });

    promise = promise.then((response) => ({ok: true, response}));

    return Promise.race([
        promise,
        timeout(promise, time)
    ]);
}