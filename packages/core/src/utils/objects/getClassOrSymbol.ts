import {classOf} from "./classOf.js";
import {isClass} from "./isClass.js";

export function getClassOrSymbol(target: any): any {
  return isClass(target) ? classOf(target) : target;
}
