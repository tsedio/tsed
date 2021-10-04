import {isStream} from "./isStream";
import {isBoolean} from "./isBoolean";
import {isNumber} from "./isNumber";
import {isString} from "./isString";
import {isNil} from "./isNil";

export function isSerializable(data: any) {
  return !(Buffer.isBuffer(data) || isStream(data) || isBoolean(data) || isNumber(data) || isString(data) || isNil(data));
}
