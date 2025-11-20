import type {Type} from "@tsed/core";

import type {ProviderScope} from "../domain/ProviderScope.js";
import type {ProviderType} from "../domain/ProviderType.js";
import type {TokenProvider} from "./TokenProvider.js";

/**
 * Configuration options for registering a provider in the DI container.
 *
 * Defines how a provider should be created, managed, and resolved by the injector.
 * Supports multiple creation strategies including class instantiation, factory functions, and predefined values.
 *
 * ### Usage
 *
 * ```typescript
 * // Using a class
 * const opts1: ProviderOpts = {
 *   token: MyService,
 *   useClass: MyService
 * };
 *
 * // Using a factory
 * const opts2: ProviderOpts = {
 *   token: "CONFIG",
 *   useFactory: () => loadConfig()
 * };
 *
 * // Using a value
 * const opts3: ProviderOpts = {
 *   token: "API_KEY",
 *   useValue: "secret-key"
 * };
 * ```
 *
 * @typeParam T - The type of instance provided by this provider
 * @public
 */
export interface ProviderOpts<T = any> {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  token: TokenProvider<T>;
  /**
   * Create alias token to retrieve the instance provider.
   */
  alias?: TokenProvider;
  /**
   * Provider type
   */
  type?: TokenProvider | ProviderType;
  /**
   * Instance build by the injector
   */
  instance?: T;
  /**
   * Define dependencies to build the provider
   */
  deps?: TokenProvider[];
  /**
   * Class to instantiate for the `token`.
   */
  useClass?: Type<T>;
  /**
   * Provide a function to build the provider
   */
  useFactory?: Function;
  /**
   * Provide an async function to build the provider
   */
  useAsyncFactory?: Function;
  /**
   * Provide predefined value
   */
  useValue?: any;
  /**
   * Scope used by the injector to build the provider.
   */
  scope?: ProviderScope;

  /**
   * hooks to intercept custom events
   */
  hooks?: Record<string, (instance: T, ...args: any[]) => Promise<any> | any>;
  /**
   *
   */
  [key: string]: any;
}
