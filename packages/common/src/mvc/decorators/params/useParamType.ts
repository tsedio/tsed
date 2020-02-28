import {ParamTypes} from "../../models/ParamTypes";
import {ParamFn} from "./paramFn";

export function UseParamType(paramType: string | ParamTypes) {
  return ParamFn(param => {
    param.paramType = paramType;
  });
}
