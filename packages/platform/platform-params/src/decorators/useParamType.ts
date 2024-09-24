import {isBuffer, useDecorators} from "@tsed/core";
import {isParameterType, Name} from "@tsed/schema";

import {ParamOptions} from "../domain/ParamOptions.js";
import {PARAM_TYPES_DATA_PATH, ParamTypes} from "../domain/ParamTypes.js";
import {ParamFn} from "./paramFn.js";
import {UseParamExpression} from "./useParamExpression.js";

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

      if (isBuffer(param.type) || isBuffer(options.useType) || options.paramType === ParamTypes.RAW_BODY) {
        param.paramType = ParamTypes.RAW_BODY;
        param.parent.operation?.consumes(["*/*"]);
      }

      param.dataPath = options.dataPath || PARAM_TYPES_DATA_PATH[param.paramType] || "$ctx";
    }),
    options.expression && UseParamExpression(options.expression),
    options.expression && Name(options.expression)
  );
}
