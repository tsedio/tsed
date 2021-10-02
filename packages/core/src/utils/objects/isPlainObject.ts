import {classOf} from "./classOf";

/**
 *
 * @param target
 * @returns {boolean}
 */
export function isClassObject(target: any): target is Object {
  return target === Object;
}

export function isPlainObject(target: any): boolean {
  return isClassObject(classOf(target)) && target !== Object;
}
