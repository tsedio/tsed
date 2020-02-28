import {ParseExpressionPipe} from "../../pipes/ParseExpressionPipe";
import {ParamFn} from "./paramFn";

export function UseParamExpression(expression: string) {
  return ParamFn(param => {
    param.expression = expression;
    param.pipes.push(ParseExpressionPipe);
  });
}
