import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

declare global {
  namespace TsED {
    export interface NextFunction extends Function {}
  }
}

export type Next = TsED.NextFunction;

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): ParameterDecorator {
  return UseParam(ParamTypes.NEXT_FN, {
    useConverter: false,
    useValidation: false
  });
}
