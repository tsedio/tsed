import {nameOf} from "./nameOf";

/**
 * Tests to see if the object is Buffer
 * @param target
 * @returns {boolean}
 */
export function isBuffer(target: any): target is Buffer {
  // is Class
  if (target && "isBuffer" in target && typeof target.isBuffer === "function") {
    return true;
  }

  return isUint8Array(target);
}

export function isUint8Array(target: any): target is Uint8Array {
  return !!(target && (target === Uint8Array || target instanceof Uint8Array));
}
