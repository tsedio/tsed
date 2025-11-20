import {InjectorService} from "../services/InjectorService.js";

let globalInjector: InjectorService = new InjectorService();

/**
 * Get the global injector service instance.
 *
 * Returns the singleton instance of `InjectorService` managing all registered providers.
 * Use this to access the DI container programmatically.
 *
 * ### Usage
 *
 * ```typescript
 * import {injector, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   injector = injector();
 *
 *   getService() {
 *     return injector().get(OtherService);
 *   }
 * }
 * ```
 *
 * @returns The global injector service instance
 * @public
 */
export function injector(): InjectorService {
  return globalInjector;
}

/**
 * Destroy the current injector and create a fresh instance.
 *
 * Calls the `destroy()` lifecycle hook on all providers and resets the global injector.
 * Primarily used in testing to reset the DI container between tests.
 *
 * @returns Promise that resolves when destruction is complete
 * @public
 */
export async function destroyInjector() {
  await globalInjector.destroy();
  globalInjector = new InjectorService();
}
