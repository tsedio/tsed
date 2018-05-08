import {registerMiddlewareError} from "../../registries/MiddlewareRegistry";

/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function MiddlewareError(): Function {
  return registerMiddlewareError;
}
