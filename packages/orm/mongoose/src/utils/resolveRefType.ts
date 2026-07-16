import {Store, Type, isClass, isString, nameOf} from "@tsed/core";
import {MONGOOSE_MODEL_NAME} from "../constants/constants.js";

/**
 * @ignore
 */
export function resolveRefType(type: string | (() => Type<any>) | Type<any>): string {
  if (isString(type)) {
    return type;
  }

  if (!isClass(type)) {
    type = (type as any)();
  }

  return Store.from(type).get(MONGOOSE_MODEL_NAME) || nameOf(type);
}
