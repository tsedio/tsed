import {providerBuilder} from "../domain/ProviderBuilder.js";
import {ProviderType} from "../domain/ProviderType.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";

/**
 * Fluent builder for registering providers programmatically.
 *
 * Creates or configures a provider with the specified options.
 * Can be chained with additional configuration methods.
 *
 * ### Usage
 *
 * ```typescript
 * import {injectable} from "@tsed/di";
 *
 * injectable(MyService)
 *   .scope(ProviderScope.REQUEST)
 *   .deps([DatabaseService])
 *   .build();
 *
 * // With factory
 * injectable("CONFIG")
 *   .factory(() => loadConfig())
 *   .build();
 * ```
 *
 * @public
 */
export const injectable = providerBuilder({type: ProviderType.PROVIDER});

/**
 * Fluent builder for registering interceptor providers.
 *
 * Specialized version of `injectable` that automatically sets the provider type to `INTERCEPTOR`.
 *
 * ### Usage
 *
 * ```typescript
 * import {interceptor} from "@tsed/di";
 *
 * interceptor(LogInterceptor).build();
 * ```
 *
 * @public
 */
export const interceptor = providerBuilder({
  type: ProviderType.INTERCEPTOR
});

/**
 * Fluent builder for registering controller providers.
 *
 * Specialized version of `injectable` that automatically sets the provider type to `CONTROLLER`
 * and supports controller-specific options like middlewares.
 *
 * ### Usage
 *
 * ```typescript
 * import {controller} from "@tsed/di";
 *
 * controller(UsersController)
 *   .middlewares({useBefore: [AuthMiddleware]})
 *   .build();
 * ```
 *
 * @public
 */
export const controller = providerBuilder({
  type: ProviderType.CONTROLLER
});

type Opts<Type = any> = Partial<ProviderOpts<Type>> &
  (
    | {
        token: TokenProvider<Type>;
      }
    | {
        /**
         * @deprecated use token prop instead
         */
        provide: TokenProvider<Type>;
      }
  );

/**
 * Register a provider configuration.
 * @deprecated Since v8. Use injectable() function instead.
 */
export function registerProvider<Type = any>({token, provide, ...opts}: Opts<Type>) {
  return injectable(token || provide, {
    ...opts,
    token: token || provide
  } as unknown as Partial<ProviderOpts>).inspect();
}
