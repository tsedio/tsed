import type {Type} from "@tsed/core";

import type {ProviderScope} from "../domain/ProviderScope.js";
import type {ProviderType} from "../domain/ProviderType.js";
import type {TokenProvider} from "./TokenProvider.js";

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
