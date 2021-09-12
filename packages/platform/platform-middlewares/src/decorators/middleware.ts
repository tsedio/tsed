import {Injectable, ProviderType} from "@tsed/di";

/**
 * Register a new Middleware class.
 *
 * @decorator
 * @classDecorator
 */
export function Middleware(): ClassDecorator {
  return Injectable({
    type: ProviderType.MIDDLEWARE
  });
}
