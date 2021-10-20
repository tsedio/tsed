import {classOf} from "./classOf";
import {getInheritedClass} from "./ancestorOf";
import {nameOf} from "./nameOf";

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
