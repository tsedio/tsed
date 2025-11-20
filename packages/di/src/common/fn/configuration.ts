import {Store} from "@tsed/core/types/Store.js";

import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {DIConfiguration} from "../services/DIConfiguration.js";
import {injector} from "./injector.js";

/**
 * Get or set configuration for a provider or the global injector settings.
 *
 * ### Overloads
 *
 * - `configuration()` - Returns the global DI configuration
 * - `configuration(token)` - Returns the stored configuration for a provider
 * - `configuration(token, config)` - Sets and returns configuration for a provider
 *
 * ### Usage
 *
 * ```typescript
 * import {configuration, Injectable} from "@tsed/di";
 *
 * // Get global configuration
 * const settings = configuration();
 *
 * // Set provider configuration
 * @Injectable()
 * class MyService {}
 * configuration(MyService, {custom: "value"});
 *
 * // Get provider configuration
 * const config = configuration(MyService);
 * ```
 *
 * @param token Optional provider token to get/set configuration for
 * @param configuration Optional configuration to set
 * @returns The configuration object
 * @public
 */
export function configuration(): TsED.Configuration & DIConfiguration;
export function configuration(token: TokenProvider): Partial<TsED.Configuration>;
export function configuration(token: TokenProvider, configuration: Partial<TsED.Configuration>): Partial<TsED.Configuration>;
export function configuration(token?: TokenProvider, configuration?: Partial<TsED.Configuration>) {
  if (token) {
    const store = Store.from(token);

    if (configuration) {
      store.set("configuration", configuration);
    }

    return store.get("configuration", configuration);
  }

  return injector().settings as TsED.Configuration & DIConfiguration;
}
