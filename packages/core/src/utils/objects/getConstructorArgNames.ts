import {toStringConstructor} from "./toStringConstructor.js";

export function getConstructorArgNames(target: any) {
  return toStringConstructor(target)
    .split("constructor(")[1]
    .split(")")[0]
    .split(", ")
    .filter(Boolean)
    .map((s) => s.trim());
}
