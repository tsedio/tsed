/**
 * Enumeration defining the lifecycle scopes for provider instances.
 *
 * Determines when and how provider instances are created and shared across the application.
 *
 * ### Scopes
 *
 * - `SINGLETON`: One instance shared across the entire application (default)
 * - `REQUEST`: New instance created for each request/context
 * - `INSTANCE`: New instance created on every injection
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Scope, ProviderScope} from "@tsed/di";
 *
 * @Injectable()
 * @Scope(ProviderScope.REQUEST)
 * class RequestScopedService {
 *   // New instance per request
 * }
 * ```
 *
 * @public
 */
export enum ProviderScope {
  SINGLETON = "singleton",
  REQUEST = "request",
  INSTANCE = "instance"
}
