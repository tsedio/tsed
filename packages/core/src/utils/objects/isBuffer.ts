/**
 * Tests to see if the object is Buffer
 * @param target
 * @returns {boolean}
 */
export function isBuffer(target: any): target is Buffer {
  // istanbul ignore else
  if (typeof Buffer !== "undefined") {
    return target === Buffer || target instanceof Buffer;
  }
  // istanbul ignore next
  return false;
}
