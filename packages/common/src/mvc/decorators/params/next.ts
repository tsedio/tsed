import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 * Get the Next function (for express application and middleware).
 *
 * @decorator
 * @operation
 * @input
 */
export function Next(): ParameterDecorator {
  return UseParam(ParamTypes.NEXT_FN, {
    useConverter: false,
    useValidation: false
  });
}

declare global {
  namespace TsED {
    export interface NextFunction extends Function {}
  }
}
/**
 * Get the Next function (for express application and middleware).
 *
 * @decorator
 * @operation
 * @input
 */
export type Next = TsED.NextFunction;
