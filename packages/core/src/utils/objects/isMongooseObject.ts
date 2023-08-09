import {hasJsonMethod} from "./hasJsonMethod";

export function isMongooseObject(obj: any) {
  return !!((hasJsonMethod(obj) && obj.$isMongooseModelPrototype) || (obj && obj._bsontype));
}
