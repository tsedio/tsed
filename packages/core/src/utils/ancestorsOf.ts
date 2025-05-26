import {getInheritedClass} from "./ancestorOf.js";
import {classOf} from "./classOf.js";
import {nameOf} from "./nameOf.js";

/**
 *
 * @param target
 * @returns {Array}
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
