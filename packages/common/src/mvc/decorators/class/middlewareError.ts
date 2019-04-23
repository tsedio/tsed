import {registerMiddleware} from "../../registries/MiddlewareRegistry";

/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 * @deprecated Use Middleware decorator instead of
 */
export function MiddlewareError(): Function {
  return registerMiddleware;
}
