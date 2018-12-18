import {Type} from "@tsed/core";
import {ProviderType} from "./ProviderType";

/**
 *
 */
export interface IProvider<T> {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * Class to instantiate for the `token`.
   */
  useClass?: Type<T>;

  /**
   *
   */
  instance?: T;

  /**
   * Provider type
   */
  type: ProviderType | any;

  /**
   *
   */
  [key: string]: any;
}
