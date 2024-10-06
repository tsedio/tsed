import {DIContext} from "@tsed/di";

import {PlatformHandlerType} from "../domain/PlatformHandlerType.js";

export type PlatformContextHandler<Context = DIContext> = ($ctx: Context) => any | Promise<any>;

/**
 * Create Ts.ED context handler
 * @param fn
 * @ignore
 */
export function useContextHandler(fn: PlatformContextHandler & {type?: PlatformHandlerType}) {
  fn.type = PlatformHandlerType.CTX_FN;

  return fn;
}

export function useResponseHandler(fn: PlatformContextHandler & {type?: PlatformHandlerType}) {
  fn.type = PlatformHandlerType.RESPONSE_FN;

  return fn;
}
