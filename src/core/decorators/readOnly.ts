/**
 * @module common/core
 */
import {Writable} from "./writable";
/** */
export function Readonly(): Function {
  return Writable(false);
}
