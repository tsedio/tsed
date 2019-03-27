import {isArrayOrArrayClass, isDate, isFunction, isNil, isPrimitive, isSymbol} from "./ObjectUtils";

const isBasicType = (source: any) => isNil(source) || isPrimitive(source) || isSymbol(source) || isFunction(source);

/**
 * Return a cloned value
 * @param source
 */
export function deepClone(source: any): any {
  let dest: any;

  if (isBasicType(source)) {
    return source;
  }

  if (isDate(source)) {
    return new Date(source);
  }

  dest = isArrayOrArrayClass(source) ? [] : {};

  for (const key in source) {
    // Use getOwnPropertyDescriptor instead of source[key] to prevent from trigering setter/getter.
    const descriptor = Object.getOwnPropertyDescriptor(source, key)!;

    if (descriptor) {
      if (!isFunction(descriptor.value)) {
        dest[key] = deepClone(descriptor.value);
      } else {
        Object.defineProperty(dest, key, descriptor);
      }
    }
  }

  if (!isArrayOrArrayClass(source)) {
    const prototype = Reflect.getPrototypeOf(source);
    Reflect.setPrototypeOf(dest, prototype);
  }

  return dest;
}
