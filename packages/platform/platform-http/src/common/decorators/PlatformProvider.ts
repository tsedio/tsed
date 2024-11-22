import {Type} from "@tsed/core";

import {adapter} from "../fn/adapter.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";

/**
 * Register a new platform adapter.
 * @decorator
 */
export function PlatformProvider() {
  return (klass: Type<PlatformAdapter>) => {
    adapter(klass);
  };
}
