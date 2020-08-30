import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 *
 * @returns {Function}
 * @decorator
 * @operation
 * @input
 */
export function Err(): Function {
  return UseParam(ParamTypes.ERR, {
    useValidation: false,
    useConverter: false,
  });
}
