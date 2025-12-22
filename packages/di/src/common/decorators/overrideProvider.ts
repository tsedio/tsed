import type {Type} from "@tsed/core/types/Type.js";

import {Provider} from "../domain/Provider.js";

/**
 * Override an existing provider registration with a new implementation.
 *
 * Replaces the implementation class of a registered provider while keeping the same token.
 * Useful for testing, plugin systems, or providing alternative implementations.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, OverrideProvider} from "@tsed/di";
 *
 * @Injectable()
 * class OriginalService {
 *   getData() {
 *     return "original";
 *   }
 * }
 *
 * // Override with new implementation
 * @OverrideProvider(OriginalService)
 * class MockService {
 *   getData() {
 *     return "mocked";
 *   }
 * }
 *
 * // Injected instances will now use MockService
 * @Injectable()
 * class UserService {
 *   constructor(private service: OriginalService) {
 *     console.log(this.service.getData()); // "mocked"
 *   }
 * }
 * ```
 *
 * @param originalProvider The provider class to override
 * @returns Class decorator function
 * @public
 * @decorator
 */
export function OverrideProvider(originalProvider: Type<any>): Function {
  return (target: Type<any>): void => {
    const provider = Provider.Registry.get(originalProvider);

    if (provider) {
      provider.useClass = target;
    }
  };
}
