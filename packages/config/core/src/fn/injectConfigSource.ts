import {inject, type InvokeOptions} from "@tsed/di";

import {CONFIG_SOURCES} from "../constants/constants.js";
import type {ConfigSource} from "../interfaces/ConfigSource.js";

/**
 * Injects a configuration source by name and returns it as the specified type.
 *
 * @param {string} name - The name of the configuration source to retrieve.
 * @param {Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>} [opts] - Optional invocation options to customize the behavior of the injection.
 * @return {T} The configuration source cast to the specified type.
 */
export function injectConfigSource<T extends ConfigSource = ConfigSource>(
  name: string,
  opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>
): T {
  const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES, opts);

  return configs[name] as T;
}
