import {RESPONSE_DATA} from "../../../filters/constants";
import {UseFilter} from "./useFilter";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): ParameterDecorator {
  return UseFilter(RESPONSE_DATA);
}
