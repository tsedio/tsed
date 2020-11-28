import {classOf} from "./classOf";
import {isClass} from "./isClass";

export function getClassOrSymbol(target: any): any {
  return isClass(target) ? classOf(target) : target;
}
