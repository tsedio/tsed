import {EXPRESS_ERR} from "../constants";
import {UseFilter} from "./useFilter";

/**
 *
 * @returns {Function}
 * @decorators
 */
export function Err(): Function {
  return UseFilter(EXPRESS_ERR);
}
