import {TokenProvider} from "./TokenProvider.js";

/**
 * Associates a provider token with a route path.
 *
 * Used to map controllers or route handlers to specific URL paths in the routing system.
 *
 * ### Usage
 *
 * ```typescript
 * const route: TokenRoute = {
 *   token: MyController,
 *   route: "/api/users"
 * };
 * ```
 *
 * @public
 */
export interface TokenRoute {
  token: TokenProvider;
  route: string;
}
