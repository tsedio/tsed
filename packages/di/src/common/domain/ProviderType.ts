/**
 * Enumeration categorizing different types of providers in the DI system.
 *
 * Used to classify and filter providers based on their role in the application architecture.
 * Each type represents a distinct pattern or responsibility within the framework.
 *
 * ### Types
 *
 * - `VALUE`: Simple value providers (constants, configuration)
 * - `PROVIDER`: Standard service providers
 * - `MODULE`: Module providers organizing related functionality
 * - `CONTROLLER`: HTTP route controllers
 * - `INTERCEPTOR`: Method interceptors for cross-cutting concerns
 * - `MIDDLEWARE`: Request/response middleware
 *
 * ### Usage
 *
 * ```typescript
 * import {ProviderType} from "@tsed/di";
 *
 * const providers = container.getProviders(ProviderType.CONTROLLER);
 * ```
 *
 * @public
 */
export enum ProviderType {
  VALUE = "value",
  PROVIDER = "provider",
  MODULE = "module",
  CONTROLLER = "controller",
  INTERCEPTOR = "interceptor",
  MIDDLEWARE = "middleware"
}
