import {registerMiddleware} from "../../registries/MiddlewareRegistry";

/**
 * Register a new Middleware class.
 *
 * @decorator
 * @classDecorator
 */
export function Middleware(): ClassDecorator {
  return registerMiddleware;
}
