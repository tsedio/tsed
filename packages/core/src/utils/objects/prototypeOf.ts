import {classOf} from "./classOf.js";

/**
 * Return the prototype of the given class.
 * @param target
 * @returns {any}
 */
export function prototypeOf(target: any) {
  return classOf(target) === target ? target.prototype : target;
}
