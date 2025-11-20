import {isFunction} from "@tsed/core/utils/isFunction.js";

import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {inject} from "./inject.js";
import {injector} from "./injector.js";

/**
 * Lazily load and inject a provider from a dynamic import.
 *
 * Loads the provider module asynchronously, registers it if needed, calls `$onInit` if present,
 * and returns the resolved instance. Useful for code splitting and lazy loading dependencies.
 *
 * ### Usage
 *
 * ```typescript
 * import {lazyInject} from "@tsed/di";
 *
 * // Lazy load a service
 * const service = await lazyInject(() => import("./HeavyService"));
 *
 * // Use in a method
 * async loadPlugin() {
 *   const plugin = await lazyInject(() => import("./plugins/MyPlugin"));
 *   return plugin.initialize();
 * }
 * ```
 *
 * @typeParam Token The type of the provider to inject
 * @param factory Function returning a dynamic import promise with a default export
 * @returns Promise resolving to the provider instance
 * @public
 */
export async function lazyInject<Token>(factory: () => Promise<{default: TokenProvider<Token>}>): Promise<Token> {
  const {default: token} = await factory();

  if (!injector().has(token)) {
    const instance = await inject(token);

    const instanceWithHook = instance as unknown as {$onInit?: () => Promise<void>};

    if ("$onInit" in instanceWithHook && isFunction(instanceWithHook.$onInit)) {
      await instanceWithHook.$onInit();
    }
  }

  return injector().get(token) as unknown as Promise<Token>;
}

/**
 * Attempt to lazily load and inject a provider, returning undefined on failure.
 *
 * Similar to `lazyInject` but catches errors and returns undefined instead of throwing.
 * Useful for optional dependencies that may not be available.
 *
 * ### Usage
 *
 * ```typescript
 * import {optionalLazyInject} from "@tsed/di";
 *
 * // Try to load optional plugin
 * const plugin = await optionalLazyInject(() => import("./optional/Plugin"));
 *
 * if (plugin) {
 *   plugin.activate();
 * }
 * ```
 *
 * @typeParam Token The type of the provider to inject
 * @param factory Function returning a dynamic import promise with a default export
 * @returns Promise resolving to the provider instance or undefined if loading fails
 * @public
 */
export async function optionalLazyInject<Token>(
  factory: () => Promise<{
    default: TokenProvider;
  }>
): Promise<Token | undefined> {
  try {
    return await lazyInject(factory);
  } catch (er) {
    return undefined;
  }
}
