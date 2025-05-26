import {isArrayOrArrayClass} from "./isArray.js";
import {isArrowFn} from "./isArrowFn.js";
import {isBuffer} from "./isBuffer.js";
import {isDate} from "./isDate.js";
import {isClassObject} from "./isPlainObject.js";
import {isPrimitiveOrPrimitiveClass} from "./isPrimitive.js";
import {isPromise} from "./isPromise.js";
import {isSymbol} from "./isSymbol.js";

export function isClass(target: any) {
  if (!target) {
    return false;
  }

  if (isArrowFn(target)) {
    return false;
  }

  return !(
    isSymbol(target) ||
    isPrimitiveOrPrimitiveClass(target) ||
    isClassObject(target) ||
    isDate(target) ||
    isPromise(target) ||
    isArrayOrArrayClass(target) ||
    isBuffer(target)
  );
}
