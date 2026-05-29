import type {Type} from "@tsed/core";

import type {ConfigSource, InitialConfigSourceOptions} from "../interfaces/ConfigSource.js";

export function withOptions<Opts>(
  use: Type<ConfigSource<Opts>>,
  {name, priority, validationSchema, enabled, refreshOn, watch, ...opts}: InitialConfigSourceOptions & Opts
) {
  return {
    name,
    priority,
    validationSchema,
    use,
    watch,
    refreshOn,
    enabled: enabled !== false,
    options: opts
  };
}
