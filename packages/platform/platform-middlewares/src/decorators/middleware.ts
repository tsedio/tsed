import type {ProviderOpts} from "@tsed/di";
import {Injectable, ProviderType} from "@tsed/di";

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
