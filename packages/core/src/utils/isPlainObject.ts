import {classOf} from "./classOf.js";

/**
 * Checks if a value is the Object constructor.
 *
 * @public
 * @since v7.0.0
 */
export function isClassObject(target: any): target is Object {
  return target === Object;
}

/**
 * Checks if a value is a plain object (not a class instance or constructor).
 *
 * @public
 * @since v7.0.0
 */
export function isPlainObject(target: any): boolean {
  return isClassObject(classOf(target)) && target !== Object;
}
