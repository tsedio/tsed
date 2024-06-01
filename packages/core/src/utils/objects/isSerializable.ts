import {isStream} from "./isStream.js";
import {isBoolean} from "./isBoolean.js";
import {isNumber} from "./isNumber.js";
import {isString} from "./isString.js";
import {isNil} from "./isNil.js";

export function isSerializable(data: any) {
  return !(Buffer.isBuffer(data) || isStream(data) || isBoolean(data) || isNumber(data) || isString(data) || isNil(data));
}
