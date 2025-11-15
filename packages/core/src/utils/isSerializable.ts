import {isBoolean} from "./isBoolean.js";
import {isNil} from "./isNil.js";
import {isNumber} from "./isNumber.js";
import {isStream} from "./isStream.js";
import {isString} from "./isString.js";

/**
 * Checks if data requires serialization by excluding buffers, streams, and primitive types.
 *
 * @public
 * @since v7.0.0
 */
export function isSerializable(data: any) {
  return !(Buffer.isBuffer(data) || isStream(data) || isBoolean(data) || isNumber(data) || isString(data) || isNil(data));
}
