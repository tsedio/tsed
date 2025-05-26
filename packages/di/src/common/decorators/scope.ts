import {StoreSet} from "@tsed/core/decorators/storeSet.js";

import {ProviderScope} from "../domain/ProviderScope.js";

/**
 *
 * @param {"request" | "singleton" | ProviderScope} scope
 * @returns {Function}
 * @constructor
 */
export function Scope(scope: "request" | "singleton" | ProviderScope = ProviderScope.REQUEST) {
  return StoreSet("scope", scope);
}
