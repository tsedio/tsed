import {ancestorOf} from "./ancestorOf.js";
import {classOf} from "./classOf.js";
import {nameOf} from "./nameOf.js";

export function isInheritedFrom(target: any, from: any, deep = 5): boolean {
  if (!target || !from) {
    return false;
  }

  target = classOf(target);
  from = classOf(from);

  while (nameOf(target) !== "") {
    if (!deep) {
      return false;
    }
    if (target === from) {
      return true;
    }

    target = ancestorOf(target);
    deep--;
  }

  return false;
}
