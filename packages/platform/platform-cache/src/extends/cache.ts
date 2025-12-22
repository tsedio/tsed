import {type Type} from "@tsed/core";
import {ProviderBuilder} from "@tsed/di";

import {PlatformCacheInterceptor} from "../interceptors/PlatformCacheInterceptor.js";
import type {PlatformCacheOptions} from "../interfaces/PlatformCacheOptions.js";

declare global {
  namespace TsED {
    interface ClassProviderBuilder<Token extends Type> {
      /**
       * Configures caching for a class method by applying the PlatformCacheInterceptor.
       * The interceptor will cache the method's return value and serve it from cache on subsequent calls.
       *
       * ```typescript
       * import {injectable} from "@tsed/di";
       * import "@tsed/platform-cache";
       *
       * class UserService {
       *   async getUsers(): Promise<User[]> {
       *     return this.userRepository.find();
       *   }
       * }
       *
       * injectable(UserService)
       *   .cache("getUsers")
       * ```
       *
       * @param propertyKey - The name of the method to be cached
       * @param options - Optional cache settings (TTL, cache key, etc.)
       * @returns The provider builder instance for method chaining
       *
       */
      cache(propertyKey: keyof InstanceType<Token>, options?: PlatformCacheOptions): this;
    }
  }
}

ProviderBuilder.add("cache", (providerBuilder) => {
  return (propertyKey: string, options: PlatformCacheOptions = {}) => {
    providerBuilder.intercept(propertyKey, PlatformCacheInterceptor, options as Record<string, unknown>);

    return providerBuilder;
  };
});
