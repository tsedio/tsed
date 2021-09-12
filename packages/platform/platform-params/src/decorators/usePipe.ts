import {Type} from "@tsed/core";
import {PipeMethods} from "../domain/ParamMetadata";
import {ParamFn} from "./paramFn";

/**
 * Register a Pipe to be used with the current decorated param.
 *
 * @param token
 * @param options
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UsePipe(token: Type<PipeMethods>, options: any = {}) {
  return ParamFn((param) => {
    param.store.set(token, options);
    param.pipes.push(token);
  });
}
