import {classOf} from "./classOf.js";
import {isDate} from "./isDate.js";
import {isFunction} from "./isFunction.js";
import {isNil} from "./isNil.js";
import {isPrimitive} from "./isPrimitive.js";
import {isRegExp} from "./isRegExp.js";
import {isSymbol} from "./isSymbol.js";

const isBasicType = (source: any) => isNil(source) || isPrimitive(source) || isSymbol(source) || isFunction(source);

/**
 * Creates a deep clone of the provided value, preserving prototype chains and handling circular references.
 *
 * Supports primitives, dates, regular expressions, typed arrays, buffers, maps, sets, and plain objects.
 * Uses a WeakMap to track and handle circular references correctly.
 *
 * @public
 * @since v7.0.0
 */
export const deepClone = (source: any, stack = new WeakMap()): any => {
  // provides an early exit for simple cases
  if (isBasicType(source)) {
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
    source.forEach((item, idx) => (clone[idx] = deepClone(item, stack)));
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

  const clone = Object.create(Reflect.getPrototypeOf(source));
  stack.set(source, clone);

  Reflect.ownKeys(source).forEach((key) => {
    // respects property descriptors and the prototype chain more explicitly, which is important for objects with getter/setter.
    const descriptor = Object.getOwnPropertyDescriptor(source, key);

    if (descriptor) {
      if (!isFunction(descriptor.value)) {
        Object.defineProperty(clone, key, {
          ...descriptor,
          value: deepClone(descriptor.value, stack)
        });
      } else {
        Object.defineProperty(clone, key, descriptor);
      }
    }
  });

  return clone;
};
