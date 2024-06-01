import {ParamFn} from "./paramFn.js";

/**
 * Get data from a path inside the given object
 *
 * @param expression
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParamExpression(expression?: string) {
  return ParamFn((param) => {
    param.expression = expression || "";
  });
}
