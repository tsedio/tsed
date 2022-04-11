import {isArrayOrArrayClass} from "./isArray";
import {isArrowFn} from "./isArrowFn";
import {isBuffer} from "./isBuffer";
import {isDate} from "./isDate";
import {isClassObject} from "./isPlainObject";
import {isPrimitiveOrPrimitiveClass} from "./isPrimitive";
import {isPromise} from "./isPromise";
import {isSymbol} from "./isSymbol";

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
