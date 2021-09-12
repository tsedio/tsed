import {useDecorators} from "@tsed/core";
import {isParameterType, Name} from "@tsed/schema";
import {ParamFn} from "./paramFn";
import {ParamOptions} from "../domain/ParamOptions";
import {UseParamExpression} from "./useParamExpression";

/**
 * Get the object from request (like body, params, query, etc...).
 *
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParamType(options: ParamOptions) {
  return useDecorators(
    ParamFn((param) => {
      if (isParameterType(options.paramType)) {
        param.parameter!.in(options.paramType);
      }

      param.paramType = options.paramType;
      param.dataPath = options.dataPath;
    }),
    UseParamExpression(options.expression),
    options.expression && Name(options.expression)
  );
}
