import {Type} from "@tsed/core/types/Type.js";

import type {Provider} from "../domain/Provider.js";

/**
 * @ignore
 */
export interface RegistrySettings {
  injectable?: boolean;
  model?: Type<Provider>;
}
