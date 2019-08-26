/**
 * Get the class constructor
 * @param target
 */
export function getConstructor(target: any): Function {
  return typeof target === "function" ? target : target.constructor;
}

/**
 * Get the class constructor
 * @param target
 */
export function constructorOf(target: any): Function {
  return getConstructor(target);
}

export function toStringConstructor(target: any): string {
  const ctr = getConstructor(target);
  const strings = ctr.toString().split("\n");
  const ctrString = strings.find(s => s.indexOf("constructor(") > -1) || "constructor()";

  return `${ctrString.replace("{", "").trim()}`;
}

export function getConstructorArgNames(target: any) {
  return toStringConstructor(target)
    .replace("constructor(", "")
    .replace(")", "")
    .split(", ")
    .filter(Boolean);
}

/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 */
export function getClass(target: any): any {
  return target.prototype ? target : target.constructor;
}

/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 * @alias getClass
 */
export function classOf(target: any) {
  return getClass(target);
}

/**
 *
 * @param target
 * @returns {symbol}
 */
export function getClassOrSymbol(target: any): any {
  return isClass(target) ? getClass(target) : target;
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
 */
export function isSymbol(target: any) {
  return typeof target === "symbol" || target instanceof Symbol || target === Symbol;
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
 * Return true if the given obj is a primitive.
 * @param target
 * @returns {boolean}
 */
export function isPrimitiveOrPrimitiveClass(target: any): boolean {
  return isString(target) || isNumber(target) || isBoolean(target);
}

export function isPrimitive(target: any): boolean {
  return isPrimitiveOrPrimitiveClass(target);
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
  return target === Array || isArray(target);
}

/**
 * Return true if the target.
 * @param target
 * @returns {boolean}
 */
export function isCollection(target: any): boolean {
  return (
    isArrayOrArrayClass(target) ||
    target === Map ||
    target instanceof Map ||
    target === Set ||
    target instanceof Set ||
    target === WeakMap ||
    target instanceof WeakMap ||
    target === WeakSet ||
    target instanceof WeakSet
  );
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isDate(target: any): boolean {
  return target === Date || (target instanceof Date && !isNaN(+target));
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isClassObject(target: any): boolean {
  return target === Object;
}

export function isObject(target: any): boolean {
  return typeof target === "object";
}

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isClass(target: any) {
  if (!target) {
    return false;
  }

  if (isArrowFn(target)) {
    return false;
  }

  return !(isSymbol(target) || isPrimitiveOrPrimitiveClass(target) || isClassObject(target) || isDate(target) || isPromise(target));
}

export function isFunction(target: any) {
  return typeof target === "function";
}

export function isArrowFn(target: any) {
  return target && isFunction(target) && !target.prototype;
}

/**
 *
 * @param value
 */
export function isNil(value: any) {
  return value === undefined || value === null;
}

/**
 * Return true if the value is an empty string, null or undefined.
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value: any): boolean {
  return value === "" || isNil(value);
}

/**
 * Tests to see if the object is an ES2015 (ES6) Promise
 * @see {@link https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects}
 * @param target
 * @returns {boolean}
 */
export function isPromise(target: any): boolean {
  return (
    target === Promise ||
    target instanceof Promise ||
    (!!target && typeof target.subscribe !== "function" && typeof target.then === "function")
  );
}

export function isStream(obj: any) {
  return obj !== null && typeof obj === "object" && typeof obj.pipe === "function";
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

export function isInheritedFrom(target: any, from: any, deep = 5): boolean {
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

/**
 * Get object name
 */
export function nameOf(obj: any): string {
  switch (typeof obj) {
    default:
      return "" + obj;
    case "symbol":
      return nameOfSymbol(obj);
    case "function":
      return nameOfClass(obj);
  }
}

/**
 * Get the provide name.
 * @param targetClass
 */
export function nameOfClass(targetClass: any): string {
  return typeof targetClass === "function" ? targetClass.name : targetClass.constructor.name;
}

/**
 * Get symbol name.
 * @param sym
 */
export const nameOfSymbol = (sym: symbol): string =>
  sym
    .toString()
    .replace("Symbol(", "")
    .replace(")", "");

/**
 * Return the descriptor for a given class and propertyKey
 * @param target
 * @param {string} propertyKey
 * @returns {PropertyDescriptor}
 */
export function descriptorOf(target: any, propertyKey: string | symbol): PropertyDescriptor {
  return Object.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey)!;
}

export function inheritedDescriptorOf(target: any, propertyKey: string): PropertyDescriptor | undefined {
  for (const klass of ancestorsOf(target)) {
    const descriptor = Object.getOwnPropertyDescriptor((klass && klass.prototype) || klass, propertyKey)!;

    if (descriptor) {
      return descriptor;
    }
  }

  return undefined;
}

/**
 * Return the prototype of the given class.
 * @param target
 * @returns {any}
 */
export function prototypeOf(target: any) {
  return classOf(target) === target ? target.prototype : target;
}

/**
 *
 * @param obj
 * @param key
 */
export function isEnumerable(obj: any, key: string) {
  const klass = getClass(obj);

  if (klass) {
    const descriptor = inheritedDescriptorOf(klass, key);

    if (descriptor) {
      return descriptor.enumerable;
    }
  }

  return obj.propertyIsEnumerable(key);
}

/**
 * Return all enumerable keys of the given object
 * @param obj
 */
export function getKeys(obj: any) {
  const keys: string[] = [];

  for (const key in obj) {
    if (isEnumerable(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Return all methods for a given class.
 * @param target
 */
export function methodsOf(target: any) {
  const methods = new Map();
  target = classOf(target);

  ancestorsOf(target).forEach(target => {
    const keys = Reflect.ownKeys(prototypeOf(target));

    keys.forEach((propertyKey: string) => {
      if (propertyKey !== "constructor") {
        methods.set(propertyKey, {target, propertyKey});
      }
    });
  });

  return Array.from(methods.values());
}
