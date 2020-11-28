import {toStringConstructor} from "./toStringConstructor";

export function getConstructorArgNames(target: any) {
  return toStringConstructor(target).replace("constructor(", "").replace(")", "").split(", ").filter(Boolean);
}
