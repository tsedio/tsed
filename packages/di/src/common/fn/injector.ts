import {InjectorService} from "../services/InjectorService.js";

/**
 * Create or return the existing injector service.
 *
 * Example:
 *
 * ```typescript
 * import {injector, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   injector = injector();
 * }
 * ```
 */
export function injector(): InjectorService {
  return InjectorService.getInstance();
}

/**
 * Alias of injector
 * @alias injector
 */
export const $injector = injector;
