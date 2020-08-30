import {
  classOf,
  isArrowFn,
  isClass,
  isClassObject,
  isCollection,
  isDate,
  isPrimitiveOrPrimitiveClass,
  isPromise,
  isSymbol,
  Type,
} from "@tsed/core";

export function getComputedType(target: any): Type<any> {
  if (isPromise(target)) {
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
