import {getInheritedClass} from "./ancestorOf.js";
import {classOf} from "./classOf.js";
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

  while (currentTarget && nameOf(currentTarget) !== "") {
    classes.unshift(currentTarget);
    currentTarget = getInheritedClass(currentTarget);
  }

  return classes;
}
