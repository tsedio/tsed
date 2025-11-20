import {injectable} from "../fn/injectable.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";

/**
 * Declare a class as an injectable provider in the DI system.
 *
 * Registers a class as a provider that can be injected into other services, controllers, or interceptors.
 * By default, providers are singleton-scoped and built once during application initialization.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable} from "@tsed/di";
 *
 * @Injectable()
 * export class MyService {
 *   getData() {
 *     return "data";
 *   }
 * }
 *
 * // With options
 * @Injectable({
 *   scope: ProviderScope.REQUEST,
 *   type: ProviderType.PROVIDER
 * })
 * export class RequestScopedService {}
 * ```
 *
 * ### Options
 *
 * - `type`: Provider category (default: `ProviderType.PROVIDER`)
 * - `scope`: Instance lifecycle scope (default: `ProviderScope.SINGLETON`)
 * - `token`: Custom injection token (overrides class reference)
 * - `deps`: Explicit constructor dependencies (overrides TypeScript metadata)
 *
 * @param options Provider configuration options
 * @returns Class decorator function
 * @public
 * @decorator
 */
export function Injectable(options: Partial<ProviderOpts> = {}): ClassDecorator {
  return (target: any) => {
    const opts = {
      ...options,
      ...(options.token ? {useClass: target} : {token: target})
    };
    injectable(opts.token, opts);
  };
}
