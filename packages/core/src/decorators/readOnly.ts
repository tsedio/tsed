import {Writable} from "./writable.js";

export function Readonly(): Function {
  return Writable(false);
}
