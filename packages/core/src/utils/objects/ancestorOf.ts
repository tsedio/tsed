import {classOf} from "./classOf";
import {getInheritedClass} from "./getInheritedClass";
import {nameOf} from "./nameOf";

/**
 *
 * @param target
 * @returns {Array}
 */
export function ancestorsOf(target: any) {
  const classes = [];

  let currentTarget = classOf(target);

  while (nameOf(currentTarget) !== "") {
    classes.unshift(currentTarget);
    currentTarget = getInheritedClass(currentTarget);
  }

  return classes;
}
