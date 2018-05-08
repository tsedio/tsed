import {registerMiddleware} from "../../registries/MiddlewareRegistry";

/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function Middleware(): Function {
  return registerMiddleware;
}
