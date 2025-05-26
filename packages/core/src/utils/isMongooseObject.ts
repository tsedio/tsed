import {hasJsonMethod} from "./hasJsonMethod.js";

export function isObjectID(obj: any) {
  return obj && obj._bsontype;
}

export function isMongooseObject(obj: any) {
  return !!((hasJsonMethod(obj) && obj.$isMongooseModelPrototype) || isObjectID(obj));
}
