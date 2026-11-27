import {isArrayOrArrayClass} from "./isArray.js";
import {isArrowFn} from "./isArrowFn.js";
import {isBuffer} from "./isBuffer.js";
import {isClassObject} from "./isPlainObject.js";
import {isDate} from "./isDate.js";
import {isPromise} from "./isPromise.js";
import {isTemporal} from "./isTemporal.js";

/**
 * Determines whether a given value represents a class (constructor function).
 *
 * This helper filters out common non-class values such as primitives, symbols,
 * plain objects, dates, promises, arrays, buffers, and arrow functions.
 *
 * @public
 * @since v7.0.0
 */
export function isClass(target: any) {
  if (!target) {
    return false;
  }

  const type = typeof target;

  // primitives are never classes: skip the checks below (bigint keeps the previous path)
  if (type === "string" || type === "number" || type === "boolean" || type === "symbol") {
    return false;
  }

  if (isArrowFn(target)) {
    return false;
  }

  return !(
    // the part of isPrimitiveOrPrimitiveClass() the typeof check above does not cover
    (
      target === String ||
      target === Number ||
      target === Boolean ||
      target instanceof String ||
      target instanceof Number ||
      target instanceof Boolean ||
      isClassObject(target) ||
      isDate(target) ||
      isTemporal(target) ||
      isPromise(target) ||
      isArrayOrArrayClass(target) ||
      isBuffer(target)
    )
  );
}
