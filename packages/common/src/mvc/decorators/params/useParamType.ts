import {isParameterType} from "@tsed/schema";
import {ParamTypes} from "../../models/ParamTypes";
import {ParamFn} from "./paramFn";

/**
 * Get the object from request (like body, params, query, etc...).
 *
 * @param paramType
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParamType(paramType: string | ParamTypes) {
  return ParamFn((param) => {
    if (isParameterType(paramType)) {
      param.parameter!.in(paramType);
    }

    param.paramType = paramType;
  });
}
