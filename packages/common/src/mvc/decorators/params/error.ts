import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";

/**
 *
 * @returns {Function}
 * @decorators
 */
export function Err(): Function {
  return UseFilter(ParamTypes.ERR, {
    useValidation: false,
    useConverter: false
  });
}
