import {registerMiddleware} from "../../registries/MiddlewareRegistry";

/**
 *
 * @decorator
 * @deprecated Use Middleware decorator instead of
 */
export function MiddlewareError(): Function {
  return registerMiddleware;
}
