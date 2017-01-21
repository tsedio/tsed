/**
 * Get the class constructor if target is an instance.
 * @param target
 * @returns {*}
 */
export function getClass(target: any): any {
   return target.prototype ? target : target.constructor;
}

/**
 * Give the type of val.
 * @param target
 * @param type
 * @returns {boolean}
 */
export function isTargetType(target: any, type: "object" | "string"): boolean {
    return typeof target === type;
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
export function isArrayOrArrayClass(target: Function): boolean {
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
export function isCollection(target): boolean {
    return isArrayOrArrayClass(target) || target === Map || target === Set || target === WeakMap || target === WeakSet;
}
/**
 * Return true if the value is an empty string, null or undefined.
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
}
