import type {Type} from "@tsed/core";

import type {PlatformAdapter} from "../services/PlatformAdapter.js";
import {registerPlatformAdapter} from "../utils/registerPlatformAdapter.js";

export function PlatformProvider() {
  return (klass: Type<PlatformAdapter>) => {
    registerPlatformAdapter(klass);
  };
}
