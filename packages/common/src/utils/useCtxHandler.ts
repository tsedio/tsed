import {PlatformContext} from "../domain/PlatformContext";
import {HandlerType} from "../interfaces/HandlerType";

export type PlatformCtxHandler = ($ctx: PlatformContext) => any | Promise<any>;

/**
 * Create Ts.ED context handler
 * @param fn
 * @ignore
 */
export function useCtxHandler(fn: PlatformCtxHandler & {type?: HandlerType}) {
  fn.type = HandlerType.CTX_FN;

  return fn;
}
