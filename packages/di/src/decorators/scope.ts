import {StoreSet} from "@tsed/core";
import {ProviderScope} from "../interfaces/ProviderScope";

/**
 *
 * @param {"request" | "singleton" | ProviderScope} scope
 * @returns {Function}
 * @constructor
 */
export function Scope(scope: "request" | "singleton" | ProviderScope = ProviderScope.REQUEST) {
  return StoreSet("scope", scope);
}
