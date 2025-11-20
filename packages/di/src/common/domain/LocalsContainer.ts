import {Hooks} from "@tsed/hooks";

import type {TokenProvider} from "../interfaces/TokenProvider.js";

/**
 * Container for request-scoped and instance-scoped provider instances.
 *
 * Stores instances created within a specific execution context (like an HTTP request).
 * Manages lifecycle hooks and destruction of scoped instances when the context ends.
 *
 * ### Usage
 *
 * ```typescript
 * import {LocalsContainer} from "@tsed/di";
 *
 * const locals = new LocalsContainer();
 * locals.set(MyService, serviceInstance);
 *
 * const instance = locals.get(MyService);
 *
 * await locals.destroy(); // Cleanup when context ends
 * ```
 *
 * @public
 */
export class LocalsContainer extends Map<TokenProvider, any> {
  readonly hooks = new Hooks();

  async destroy() {
    await this.hooks.asyncEmit("$onDestroy");
  }
}
