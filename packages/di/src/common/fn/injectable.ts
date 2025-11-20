import {ControllerProvider} from "../domain/ControllerProvider.js";
import type {Provider} from "../domain/Provider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {providerBuilder} from "../utils/providerBuilder.js";

type PickedProps = "scope" | "path" | "alias" | "hooks" | "deps" | "imports" | "configuration" | "priority";

const Props = ["type", "scope", "path", "alias", "hooks", "deps", "imports", "configuration", "priority"];

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
export const injectable = providerBuilder<Provider, PickedProps | "type">(Props);

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
export const interceptor = providerBuilder<Provider, PickedProps | "type">(Props, {
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
export const controller = providerBuilder<ControllerProvider, PickedProps | "children" | "middlewares">([...Props, "middlewares"], {
  type: ProviderType.CONTROLLER
});
