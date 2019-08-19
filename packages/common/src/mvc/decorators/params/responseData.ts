import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): ParameterDecorator {
  return UseFilter(ParamTypes.RESPONSE_DATA);
}
