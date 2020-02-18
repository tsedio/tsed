"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the class constructor
 * @param target
 */
function getConstructor(target) {
    return typeof target === "function" ? target : target.constructor;
}
exports.getConstructor = getConstructor;
/**
 * Get the class constructor
 * @param target
 */
function constructorOf(target) {
    return getConstructor(target);
}
exports.constructorOf = constructorOf;
function toStringConstructor(target) {
    const ctr = getConstructor(target);
    const strings = ctr.toString().split("\n");
    const ctrString = strings.find(s => s.indexOf("constructor(") > -1) || "constructor()";
    return `${ctrString.replace("{", "").trim()}`;
}
exports.toStringConstructor = toStringConstructor;
function getConstructorArgNames(target) {
    return toStringConstructor(target)
        .replace("constructor(", "")
        .replace(")", "")
        .split(", ")
        .filter(Boolean);
}
exports.getConstructorArgNames = getConstructorArgNames;
/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 */
function getClass(target) {
    return target.prototype ? target : target.constructor;
}
exports.getClass = getClass;
/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 * @alias getClass
 */
function classOf(target) {
    return getClass(target);
}
exports.classOf = classOf;
/**
 *
 * @param target
 * @returns {symbol}
 */
function getClassOrSymbol(target) {
    return isClass(target) ? getClass(target) : target;
}
exports.getClassOrSymbol = getClassOrSymbol;
/**
 *
 * @param target
 * @returns {"string" | "number" | "boolean" | "any"}
 */
function primitiveOf(target) {
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
exports.primitiveOf = primitiveOf;
/**
 *
 * @param target
 */
function isSymbol(target) {
    return typeof target === "symbol" || target instanceof Symbol || target === Symbol;
}
exports.isSymbol = isSymbol;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isString(target) {
    return typeof target === "string" || target instanceof String || target === String;
}
exports.isString = isString;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isNumber(target) {
    return typeof target === "number" || target instanceof Number || target === Number;
}
exports.isNumber = isNumber;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isBoolean(target) {
    return typeof target === "boolean" || target instanceof Boolean || target === Boolean;
}
exports.isBoolean = isBoolean;
/**
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 */
function isPrimitiveOrPrimitiveClass(target) {
    return isString(target) || isNumber(target) || isBoolean(target);
}
exports.isPrimitiveOrPrimitiveClass = isPrimitiveOrPrimitiveClass;
function isPrimitive(target) {
    return isPrimitiveOrPrimitiveClass(target);
}
exports.isPrimitive = isPrimitive;
/**
 *
 * @param target
 * @returns {Boolean}
 */
function isArray(target) {
    return Array.isArray(target);
}
exports.isArray = isArray;
/**
 * Return true if the clazz is an array.
 * @param target
 * @returns {boolean}
 */
function isArrayOrArrayClass(target) {
    return target === Array || isArray(target);
}
exports.isArrayOrArrayClass = isArrayOrArrayClass;
/**
 * Return true if the target.
 * @param target
 * @returns {boolean}
 */
function isCollection(target) {
    return (isArrayOrArrayClass(target) ||
        target === Map ||
        target instanceof Map ||
        target === Set ||
        target instanceof Set ||
        target === WeakMap ||
        target instanceof WeakMap ||
        target === WeakSet ||
        target instanceof WeakSet);
}
exports.isCollection = isCollection;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isDate(target) {
    return target === Date || (target instanceof Date && !isNaN(+target));
}
exports.isDate = isDate;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isClassObject(target) {
    return target === Object;
}
exports.isClassObject = isClassObject;
function isObject(target) {
    return typeof target === "object";
}
exports.isObject = isObject;
/**
 *
 * @param target
 * @returns {boolean}
 */
function isClass(target) {
    if (!target) {
        return false;
    }
    if (isArrowFn(target)) {
        return false;
    }
    return !(isSymbol(target) || isPrimitiveOrPrimitiveClass(target) || isClassObject(target) || isDate(target) || isPromise(target));
}
exports.isClass = isClass;
function isFunction(target) {
    return typeof target === "function";
}
exports.isFunction = isFunction;
function isArrowFn(target) {
    return target && isFunction(target) && !target.prototype;
}
exports.isArrowFn = isArrowFn;
/**
 *
 * @param value
 */
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
/**
 * Return true if the value is an empty string, null or undefined.
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
    return value === "" || isNil(value);
}
exports.isEmpty = isEmpty;
/**
 * Tests to see if the object is an ES2015 (ES6) Promise
 * @see {@link https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects}
 * @param target
 * @returns {boolean}
 */
function isPromise(target) {
    return (target === Promise ||
        target instanceof Promise ||
        (!!target && typeof target.subscribe !== "function" && typeof target.then === "function"));
}
exports.isPromise = isPromise;
function isStream(obj) {
    return obj !== null && typeof obj === "object" && typeof obj.pipe === "function";
}
exports.isStream = isStream;
/**
 *
 * @param target
 * @returns {any}
 */
function getInheritedClass(target) {
    return Object.getPrototypeOf(target);
}
exports.getInheritedClass = getInheritedClass;
/**
 *
 * @param target
 * @returns {Array}
 */
function ancestorsOf(target) {
    const classes = [];
    let currentTarget = getClass(target);
    while (nameOf(currentTarget) !== "") {
        classes.unshift(currentTarget);
        currentTarget = getInheritedClass(currentTarget);
    }
    return classes;
}
exports.ancestorsOf = ancestorsOf;
function isInheritedFrom(target, from, deep = 5) {
    if (!target || !from) {
        return false;
    }
    target = classOf(target);
    from = classOf(from);
    while (nameOf(target) !== "") {
        if (!deep) {
            return false;
        }
        if (target === from) {
            return true;
        }
        target = getInheritedClass(target);
        deep--;
    }
    return false;
}
exports.isInheritedFrom = isInheritedFrom;
/**
 * Get object name
 */
function nameOf(obj) {
    switch (typeof obj) {
        default:
            return "" + obj;
        case "symbol":
            return exports.nameOfSymbol(obj);
        case "function":
            return nameOfClass(obj);
    }
}
exports.nameOf = nameOf;
/**
 * Get the provide name.
 * @param targetClass
 */
function nameOfClass(targetClass) {
    return typeof targetClass === "function" ? targetClass.name : targetClass.constructor.name;
}
exports.nameOfClass = nameOfClass;
/**
 * Get symbol name.
 * @param sym
 */
exports.nameOfSymbol = (sym) => sym
    .toString()
    .replace("Symbol(", "")
    .replace(")", "");
/**
 * Return the descriptor for a given class and propertyKey
 * @param target
 * @param {string} propertyKey
 * @returns {PropertyDescriptor}
 */
function descriptorOf(target, propertyKey) {
    return Object.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey);
}
exports.descriptorOf = descriptorOf;
function inheritedDescriptorOf(target, propertyKey) {
    for (const klass of ancestorsOf(target)) {
        const descriptor = Object.getOwnPropertyDescriptor((klass && klass.prototype) || klass, propertyKey);
        if (descriptor) {
            return descriptor;
        }
    }
    return undefined;
}
exports.inheritedDescriptorOf = inheritedDescriptorOf;
/**
 * Return the prototype of the given class.
 * @param target
 * @returns {any}
 */
function prototypeOf(target) {
    return classOf(target) === target ? target.prototype : target;
}
exports.prototypeOf = prototypeOf;
/**
 *
 * @param obj
 * @param key
 */
function isEnumerable(obj, key) {
    const klass = getClass(obj);
    if (klass) {
        const descriptor = inheritedDescriptorOf(klass, key);
        if (descriptor) {
            return descriptor.enumerable;
        }
    }
    return obj.propertyIsEnumerable(key);
}
exports.isEnumerable = isEnumerable;
/**
 * Return all enumerable keys of the given object
 * @param obj
 */
function getKeys(obj) {
    const keys = [];
    for (const key in obj) {
        if (isEnumerable(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
}
exports.getKeys = getKeys;
/**
 * Return all methods for a given class.
 * @param target
 */
function methodsOf(target) {
    const methods = new Map();
    target = classOf(target);
    ancestorsOf(target).forEach(target => {
        const keys = Reflect.ownKeys(prototypeOf(target));
        keys.forEach((propertyKey) => {
            if (propertyKey !== "constructor") {
                methods.set(propertyKey, { target, propertyKey });
            }
        });
    });
    return Array.from(methods.values());
}
exports.methodsOf = methodsOf;
//# sourceMappingURL=ObjectUtils.js.map