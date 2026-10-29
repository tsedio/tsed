import {classOf} from "./classOf.js";
import {getInheritedClass} from "./ancestorOf.js";
import {nameOf} from "./nameOf.js";

/**
 * Returns all ancestor classes in the prototype chain of the target.
 *
 * Traverses the prototype chain from the target's class up to the root,
 * returning an array of all named constructor functions encountered.
 *
 * @public
 * @since v7.0.0
 * @see classOf
 * @see getInheritedClass
 */
export function ancestorsOf(target: any) {
  const classes = [];

  let currentTarget = classOf(target);

  // the chain stops on Function.prototype, whose name is "". Inline name read for classes,
  // and push() then reverse() instead of unshift() on each level
  while (currentTarget && (typeof currentTarget === "function" ? currentTarget.name : nameOf(currentTarget)) !== "") {
    classes.push(currentTarget);
    currentTarget = getInheritedClass(currentTarget);
  }

  return classes.reverse();
}
