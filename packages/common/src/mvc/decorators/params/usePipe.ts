import {Type} from "@tsed/core";
import {IPipe} from "../../models/ParamMetadata";
import {ParamFn} from "./paramFn";

/**
 * Add a pipe to the current param
 * @param token
 * @param options
 * @decorator
 */
export function UsePipe(token: Type<IPipe>, options: any = {}) {
  return ParamFn(param => {
    param.store.set(token, options);
    param.pipes.push(token);
  });
}
