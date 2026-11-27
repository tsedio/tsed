import {ancestorOf} from "./ancestorOf.js";
import {classOf} from "./classOf.js";
import {nameOf} from "./nameOf.js";

/**
 * Checks if a target class inherits from another class within a specified depth limit.
 *
 * @public
 * @since v7.0.0
 */
export function isInheritedFrom(target: any, from: any, deep = 5): boolean {
  if (!target || !from) {
    return false;
  }

  target = classOf(target);
  from = classOf(from);

  // inline name read for classes: the chain stops on Function.prototype, whose name is ""
  while ((typeof target === "function" ? target.name : nameOf(target)) !== "") {
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
