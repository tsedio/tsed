import {nameOf} from "./nameOf.js";

/**
 * Checks if a value is a Buffer or Uint8Array instance.
 *
 * @public
 * @since v7.0.0
 */
export function isBuffer(target: any): target is Buffer {
  // is Class
  if (target && "isBuffer" in target && typeof target.isBuffer === "function") {
    return true;
  }

  return isUint8Array(target);
}

/**
 * Checks if a value is the Uint8Array constructor or a Uint8Array instance.
 *
 * @public
 * @since v7.0.0
 */
export function isUint8Array(target: any): target is Uint8Array {
  return !!(target && (target === Uint8Array || target instanceof Uint8Array));
}
