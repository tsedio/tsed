import {Enumerable} from "./enumerable.js";

export function NotEnumerable(): Function {
  return Enumerable(false);
}
