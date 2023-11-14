import {Injectable, ProviderOpts, ProviderType} from "@tsed/di";

/**
 * Register a new Middleware class.
 *
 * @decorator
 * @classDecorator
 */
export function Middleware(opts?: Partial<Omit<ProviderOpts, "type">>): ClassDecorator {
  return Injectable({
    ...opts,
    type: ProviderType.MIDDLEWARE
  });
}
