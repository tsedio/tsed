import {isBoolean} from "./isBoolean.js";
import {isNil} from "./isNil.js";
import {isNumber} from "./isNumber.js";
import {isStream} from "./isStream.js";
import {isString} from "./isString.js";

export function isSerializable(data: any) {
  return !(Buffer.isBuffer(data) || isStream(data) || isBoolean(data) || isNumber(data) || isString(data) || isNil(data));
}
