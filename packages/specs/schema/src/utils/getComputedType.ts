import {
  classOf,
  isArrowFn,
  isClass,
  isClassObject,
  isCollection,
  isDate,
  isFunction,
  isPrimitiveOrPrimitiveClass,
  isPromise,
  isSymbol,
  Type
} from "@tsed/core";

/**
 * @ignore
 */
export function getComputedType(target: any): Type<any> {
  if (isPromise(target) || target === Function) {
    return Object;
  }

  if (
    isClass(target) ||
    isSymbol(target) ||
    isPrimitiveOrPrimitiveClass(target) ||
    isClassObject(target) ||
    isDate(target) ||
    isCollection(target)
  ) {
    return classOf(target);
  }

  if (isArrowFn(target)) {
    return (target as any)();
  }

  return target;
}
