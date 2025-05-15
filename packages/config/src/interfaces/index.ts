import type {ConfigurationExtends} from "./ConfigSource.js";

/**
 * Extend the global TsED namespace to include configuration for this package.
 */
declare global {
  namespace TsED {
    interface Configuration {
      extends?: ConfigurationExtends;
    }
  }
}
