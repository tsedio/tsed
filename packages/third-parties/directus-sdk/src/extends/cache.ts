import {type Type} from "@tsed/core";
import {ProviderBuilder} from "@tsed/di";

import {DirectusCacheInterceptor, type DirectusCacheOptions} from "../cache/index.js";

declare global {
  namespace TsED {
    interface ClassProviderBuilder<Token extends Type> {
      /**
       * Programmatically applies cache interception to a method using Directus cache infrastructure.
       *
       * This function allows you to add caching to a method after the class is defined,
       * which is useful when you can't use decorators or need dynamic cache configuration.
       *
       * @example Basic usage
       *
       * ```ts
       * import {injectable} from "@tsed/di";
       * import {useDirectusCache} from "@tsed/directus-sdk";
       *
       * export class JiraIssueClient {
       *   search(query: string) {
       *     // Expensive search operation
       *     return this.performSearch(query);
       *   }
       * }
       *
       * injectable(JiraIssueClient)
       *   .directusCache("search", { ttl: 900000 });
       * ```
       *
       * ### With custom options
       *
       * ```ts
       * injectable(MyService)
       *   .directusCache("fetchData", {
       *     ttl: 60000,
       *     keyGenerator: (id: string) => `data:${id}`,
       *     namespace: "my_service:data",
       *     useSystemCache: false
       *   });
       * ```
       *
       * ### Applying cache to multiple methods
       *
       * ```ts
       * import {injectable} from "@tsed/di";
       * import {useDirectusCache} from "@tsed/directus-sdk";
       *
       * export class ApiClient {
       *   getUser(id: string) { }
       *   getPosts() { }
       * }
       * injectable(ApiClient)
       *   .directusCache("getUser", { ttl: 300000 })
       *   .directusCache("getPosts", { ttl: 60000 });
       * ```
       *
       * @template K - The class type
       * @template Props - The property key type (method name)
       *
       * @param propertyKey - The name of the method to cache
       * @param options - Cache configuration options
       *
       * @remarks
       * - Must be called after the class is marked as `@Injectable()` or `injectable()`
       * - The class must be registered in the DI container
       * - Prefer using the `@Cache` decorator when possible for better readability
       *
       * @see {@link Cache} decorator for the declarative approach
       * @see {@link DirectusCacheInterceptor} for implementation details
       */
      directusCache(propertyKey: keyof InstanceType<Token>, options?: DirectusCacheOptions): this;
    }
  }
}

ProviderBuilder.add("directusCache", (providerBuilder) => {
  return (propertyKey: string, options: DirectusCacheOptions = {}) => {
    providerBuilder.intercept(propertyKey, DirectusCacheInterceptor, options as Record<string, unknown>);

    return providerBuilder;
  };
});
