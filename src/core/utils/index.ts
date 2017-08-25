/**
 * @module common/core
 */
/** */
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

    const isPrimitive = ["string", "boolean", "number"].indexOf(typeof target);

    if (isPrimitive > -1) {
        return true;
    }

    return target instanceof String
        || target === String
        || target instanceof Number
        || target === Number
        || target instanceof Boolean
        || target === Boolean;
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
    return Object.prototype.toString.call(target) === "[object Array]";
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


export function deepExtends(out: any, obj: any, reducers: { [key: string]: (collection: any[], value: any) => any } = {}): any {

    if (obj === undefined || obj === null) {
        return obj;
    }

    if (isPrimitiveOrPrimitiveClass(obj) || typeof obj === "function") {
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

export function isPromise(target: any): boolean {
    return target === Promise || target instanceof Promise;
}

export function getInhiritedClass(target: any): any {
    return Object.getPrototypeOf(target);
}