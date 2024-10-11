import {ParamTypes, UseParam} from "@tsed/platform-params";

/**
 * @returns {Function}
 * @decorator
 * @operation
 * @input
 */
export function Err(): Function {
  return UseParam({
    paramType: ParamTypes.ERR,
    dataPath: "$ctx.error",
    useValidation: false,
    useMapper: false
  });
}
