
export function getClass(target: any): any {
   return target.prototype ? target : target.constructor;
}

/**
 *
 * @param val
 * @param type
 * @returns {boolean}
 */
export function isTargetType(val: any, type: "object" | "string"): boolean {
    return typeof val === type;
}
/**
 *
 * @param obj
 * @returns {boolean}
 */
export function isPrimitiveOrPrimitiveClass(obj: any): boolean {

    const isPrimitive = ["string", "boolean", "number"].indexOf(typeof obj);

    if (isPrimitive > -1) {
        return true;
    }

    return obj instanceof String
        || obj === String
        || obj instanceof Number
        || obj === Number
        || obj instanceof Boolean
        || obj === Boolean;
}
/**
 *
 * @param clazz
 * @returns {boolean}
 */
export function isArrayOrArrayClass(clazz: Function): boolean {
    if (clazz === Array) {
        return true;
    }
    return Object.prototype.toString.call(clazz) === "[object Array]";
}

export function isCollection(target): boolean {
    return isArrayOrArrayClass(target) || target === Map || target === Set || target === WeakMap || target === WeakSet;
}

export function isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
}
