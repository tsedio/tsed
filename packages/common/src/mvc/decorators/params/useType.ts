import {Type} from "@tsed/core";
import {ParamFn} from "./paramFn";

export function UseType(type: any | Type<any>) {
  return ParamFn(param => {
    param.type = type;
  });
}
