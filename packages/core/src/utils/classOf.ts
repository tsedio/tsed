/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 */
export function getClass(target: any): any {
  return target.prototype ? target : target.constructor;
}

/**
 * Get the provide constructor if target is an instance.
 * @param target
 * @returns {*}
 * @alias getClass
 */
export function classOf(target: any) {
  return getClass(target);
}
