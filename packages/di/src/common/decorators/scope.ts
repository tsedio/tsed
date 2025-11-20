import {StoreSet} from "@tsed/core/decorators/storeSet.js";

import {ProviderScope} from "../domain/ProviderScope.js";

/**
 * Define the lifecycle scope of a provider.
 *
 * Controls when and how provider instances are created and shared.
 * Can be combined with `@Injectable()`, `@Service()`, or other provider decorators.
 *
 * ### Scopes
 *
 * - `SINGLETON`: One instance shared across the application (default)
 * - `REQUEST`: New instance per request/context
 * - `INSTANCE`: New instance on every injection
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Scope, ProviderScope} from "@tsed/di";
 *
 * @Injectable()
 * @Scope(ProviderScope.REQUEST)
 * export class RequestScopedService {
 *   // New instance created for each request
 * }
 *
 * @Injectable()
 * @Scope("singleton")
 * export class SingletonService {
 *   // Same instance shared across the app
 * }
 * ```
 *
 * @param scope The provider scope to set (default: REQUEST)
 * @returns Class decorator function
 * @public
 * @decorator
 */
export function Scope(scope: "request" | "singleton" | ProviderScope = ProviderScope.REQUEST) {
  return StoreSet("scope", scope);
}
