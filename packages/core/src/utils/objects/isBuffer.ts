/**
 * Tests to see if the object is Buffer
 * @param target
 * @returns {boolean}
 */
export function isBuffer(target: any): target is Buffer {
  return !!(target && (target === Buffer || target instanceof Buffer));
}
