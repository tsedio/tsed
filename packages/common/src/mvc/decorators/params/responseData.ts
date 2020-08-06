import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 * Return the current response data. Prefer the @@Context@@ decorator to get or set data.
 *
 * @decorator
 * @operation
 * @input
 */
export function ResponseData(): ParameterDecorator {
  return UseParam(ParamTypes.RESPONSE_DATA);
}
