import {CONFIG_SOURCES} from "../constants/constants.js";
import {Inject} from "@tsed/di";

/**
 * Injects a specific configuration source by its name.
 *
 * @param {string} name - The name of the configuration source to inject.
 * @return {Function} A decorator that resolves the configuration source dynamically.
 */
export function InjectConfigSource(name: string) {
  return Inject(CONFIG_SOURCES, (configs: CONFIG_SOURCES) => {
    return configs[name];
  });
}
