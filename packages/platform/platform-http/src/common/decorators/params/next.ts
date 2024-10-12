import {ParamTypes, UseParam} from "@tsed/platform-params";

/**
 * Get the Next function (for express application and middleware).
 *
 * @decorator
 * @operation
 * @input
 */
export function Next(): ParameterDecorator {
  return UseParam({
    paramType: ParamTypes.NEXT_FN,
    dataPath: "next",
    useMapper: false,
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
