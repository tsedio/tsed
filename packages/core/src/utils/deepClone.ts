import {classOf} from "./classOf.js";
import {isDate} from "./isDate.js";
import {isRegExp} from "./isRegExp.js";

/**
 * Creates a deep clone of the provided value, preserving prototype chains and handling circular references.
 *
 * Supports primitives, primitive wrappers (`new Boolean()`, `new Number()`, `new String()`), dates, regular expressions,
 * typed arrays, buffers, maps, sets, and plain objects.
 * Uses a WeakMap to track and handle circular references correctly.
 *
 * @public
 * @since v7.0.0
 */
export const deepClone = (source: any, stack = new WeakMap()): any => {
  // provides an early exit for simple cases. Inline typeof checks: this runs for every cloned value
  if (source === null || typeof source !== "object") {
    return source;
  }

  const stacked = stack.get(source);

  if (stacked) {
    // See issue #1619
    return stacked;
  }

  if (ArrayBuffer.isView(source)) {
    return Buffer.isBuffer(source)
      ? Buffer.from(source)
      : // adds support for all kind of TypedArray such as Int8Array, Uint8Array, etc
        new (classOf(source))(source.buffer.slice(0), source.byteOffset, source.byteLength);
  }

  if (isDate(source)) {
    return new Date(source);
  }

  if (isRegExp(source)) {
    return new RegExp(source);
  }

  if (Array.isArray(source)) {
    const clone: unknown[] = [];
    stack.set(source, clone);

    // the length is read once and holes are skipped, as forEach does
    const length = source.length;

    for (let i = 0; i < length; i++) {
      if (i in source) {
        clone[i] = deepClone(source[i], stack);
      }
    }

    // keeps the holes at the end of the array, which the loop does not assign
    clone.length = length;

    return clone;
  }

  if (source instanceof Map) {
    const clone = new Map();
    stack.set(source, clone);
    source.forEach((value, key) => clone.set(deepClone(key, stack), deepClone(value, stack)));
    return clone;
  }

  if (source instanceof Set) {
    const clone = new Set();
    stack.set(source, clone);
    source.forEach((value) => clone.add(deepClone(value, stack)));
    return clone;
  }

  const clone = createObject(source);
  stack.set(source, clone);

  const keys = Reflect.ownKeys(source);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // respects property descriptors and the prototype chain more explicitly, which is important for objects with getter/setter.
    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);

    if (descriptor) {
      // the descriptor is a new object: the cloned value can be written into it. Accessors are kept as is
      if ("value" in descriptor && typeof descriptor.value !== "function") {
        descriptor.value = deepClone(descriptor.value, stack);
      }

      // a plain data property that nothing in the prototype chain intercepts (setter, read-only, __proto__):
      // an assignment defines the same property, faster than defineProperty
      if (descriptor.writable && descriptor.enumerable && descriptor.configurable && !(key in clone)) {
        clone[key] = descriptor.value;
      } else {
        Reflect.defineProperty(clone, key, descriptor);
      }
    }
  }

  return clone;
};

/**
 * Creates the object that receives the cloned properties, with the prototype of the source.
 * A primitive wrapper (`new Boolean()`, `new Number()`, `new String()`) keeps its value in an internal slot
 * that `Object.create()` cannot set: it gets a new wrapper holding the same value.
 */
function createObject(source: object) {
  const prototype = Reflect.getPrototypeOf(source);
  // a plain object is never a wrapper: skip the checks on the most frequent case
  const primitive = prototype === Object.prototype || prototype === null ? undefined : primitiveOf(source);

  if (primitive === undefined) {
    return Object.create(prototype);
  }

  const clone = Object(primitive);

  // a subclass of Boolean, Number or String
  if (Reflect.getPrototypeOf(clone) !== prototype) {
    Reflect.setPrototypeOf(clone, prototype);
  }

  return clone;
}

function primitiveOf(source: object): boolean | number | string | undefined {
  // instanceof only reads the prototype chain: valueOf() throws when the object has no wrapped value
  try {
    if (source instanceof Boolean) {
      return Boolean.prototype.valueOf.call(source);
    }

    if (source instanceof Number) {
      return Number.prototype.valueOf.call(source);
    }

    if (source instanceof String) {
      return String.prototype.valueOf.call(source);
    }
  } catch {
    // an object created with Object.create(Boolean.prototype), for example: cloned as an ordinary object
  }

  return undefined;
}
