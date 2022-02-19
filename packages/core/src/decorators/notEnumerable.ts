import {Enumerable} from "./enumerable";

export function NotEnumerable(): Function {
  return Enumerable(false);
}
