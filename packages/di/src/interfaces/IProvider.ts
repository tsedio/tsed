import {Type} from "@tsed/core";
import {IDIResolver} from "./IDIResolver";
import {ProviderScope} from "./ProviderScope";
import {ProviderType} from "./ProviderType";
import {TokenProvider} from "./TokenProvider";
/**
 *
 */
export interface IProvider<T = any> {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: TokenProvider;
  /**
   * Provider type
   */
  type?: ProviderType | string;
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
   * A list of resolvers which will be used to resolve missing Symbol/Class when injector invoke a Class. This property allow external DI usage.
   */
  resolvers?: IDIResolver[];

  /**
   *
   */
  [key: string]: any;
}
