import {ParseExpressionPipe} from "../../pipes/ParseExpressionPipe";
import {ParamFn} from "./paramFn";

/**
 * Get data from a path inside the given object
 *
 * @param expression
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParamExpression(expression: string) {
  return ParamFn(param => {
    param.expression = expression;
    param.pipes.push(ParseExpressionPipe);
  });
}
