import {classOf} from "./classOf.js";

/**
 * Returns the prototype of a given class or instance.
 *
 * @public
 * @since v7.0.0
 */
export function prototypeOf(target: any) {
  return classOf(target) === target ? target.prototype : target;
}
