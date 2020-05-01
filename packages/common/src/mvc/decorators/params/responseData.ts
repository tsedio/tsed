import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): ParameterDecorator {
  return UseParam(ParamTypes.RESPONSE_DATA);
}
